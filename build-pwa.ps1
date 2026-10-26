$ErrorActionPreference = 'Stop'
$utf8 = New-Object Text.UTF8Encoding $false
$root = $PSScriptRoot
$gamePath = Join-Path $root 'proev/index.html'
$html = [IO.File]::ReadAllText($gamePath)
$html = $html.Replace(', user-scalable=no', '')
$html = $html.Replace('<title>Pr&oslash;v MiniMig</title>', '<title>MiniMig</title>')
$html = [regex]::Replace($html, '(<body[^>]*>\s*)<title>MiniMig</title>', '$1')
# Public game: remove the preview-only indexing block after every import.
$html = $html.Replace('<meta name="robots" content="noindex">', '')
$html = $html.Replace('<title>MiniMig</title>', '<title>Spil MiniMig gratis - byg din egen figur</title>')
if ($html -notmatch 'name="description"') {
  $html = $html.Replace('</head>', '<meta name="description" content="Byg din egen figur i MiniMig. Gratis kreativt spil med tøj, hår og baggrunde til telefon, tablet og computer. Ingen konto eller reklamer.">' + "`n</head>")
}
if ($html -notmatch 'rel="canonical"') {
  $html = $html.Replace('</head>', '<link rel="canonical" href="https://minimig.dk/proev/">' + "`n</head>")
}
if ($html -notmatch 'pwa.js') {
  $head = '<link rel="manifest" href="../manifest.webmanifest"><meta name="theme-color" content="#FFD54A"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="MiniMig"><link rel="stylesheet" href="../pwa.css"><script src="../pwa.js" defer></script>'
  $html = $html.Replace('</head>', $head + "`n</head>")
  $html = $html.Replace('<body>', '<body class="pwa-game">')
}
[IO.File]::WriteAllText($gamePath, $html, $utf8)
$files = @(Get-ChildItem -LiteralPath $root -Recurse -File | Where-Object {
 $_.FullName -notmatch '[\\/]\.git[\\/]' -and $_.Extension -in '.html','.css','.png','.jpg','.webmanifest','.js' -and $_.Name -notin 'service-worker.js','precache-manifest.js'
} | Sort-Object FullName)
$paths = @($files | ForEach-Object { $_.FullName.Substring($root.Length + 1).Replace('\','/') })
$hashes = ($files | ForEach-Object { (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash }) -join ''
$sha = [Security.Cryptography.SHA256]::Create()
$version = ([BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes(($paths -join '|') + $hashes)))).Replace('-','').Substring(0,16)
$json = ConvertTo-Json -InputObject $paths -Compress
[IO.File]::WriteAllText((Join-Path $root 'precache-manifest.js'), "self.MINIMIG_VERSION = '$version';`nself.MINIMIG_FILES = $json;`n", $utf8)
Write-Host "PWA: $($paths.Count) files, version $version"
