$ErrorActionPreference = 'Stop'
$utf8 = New-Object Text.UTF8Encoding $false
$root = $PSScriptRoot
# MiniMig (version 2, 3D) on minimig.dk/bygogspil/ since 03-11-2026: the game page made the website's own - its name,
# the shared app manifest, search metadata and the Til voksne dialog (pwa.js, opened from the game's own button)
$gamePath = Join-Path $root 'bygogspil/index.html'
$html = [IO.File]::ReadAllText($gamePath)
$html = $html.Replace('<title>MiniMig version 2</title>', '<title>MiniMig &ndash; byg og spil</title>')
$html = $html.Replace('<link rel="manifest" href="manifest.webmanifest">', '<link rel="manifest" href="../manifest.webmanifest">')
$html = $html.Replace('<meta name="apple-mobile-web-app-title" content="MiniMig 2">', '<meta name="apple-mobile-web-app-title" content="MiniMig">')
$html = [regex]::Replace($html, '<meta name="robots" content="noindex, nofollow">(<!--[^>]*-->)?', '')
if ($html -notmatch 'name="description"') {
  $html = $html.Replace('</head>', '<meta name="description" content="Byg din egen MiniMig i 3D, dans og spil sm&aring; spil. Til b&oslash;rn fra 3 &aring;r. Ingen konto eller reklamer.">' + "`n</head>")
}
if ($html -notmatch 'rel="canonical"') {
  $html = $html.Replace('</head>', '<link rel="canonical" href="https://minimig.dk/bygogspil/">' + "`n</head>")
}
if ($html -notmatch 'src="\.\./pwa\.js"') { # (the page's own comments speak of pwa.js too)
  $html = $html.Replace('</head>', '<link rel="stylesheet" href="../pwa.css"><script src="../pwa.js" defer></script>' + "`n</head>")
}
[IO.File]::WriteAllText($gamePath, $html, $utf8)

# What is kept for use without internet. The website's own pages and pictures, and of the game what it needs to
# start - the page, three.js, the figure with its colours, the short hair, standing still, the icons and the
# backgrounds (about 25 MB). The rest - clothes, hair, hats, movements - is kept by the service worker the first time
# it is used (version 2 is over 100 MB in all). Version 1, the old addresses that only send on, and the tests are left out
$core = '^bygogspil/(index\.html|three/.*|ikoner/.*|baggrund/.*|figur\.fbx|figur-farve\.jpg|figur-staa\.json|haar-kort\.(json|jpg))$'
$files = @(Get-ChildItem -LiteralPath $root -Recurse -File | Where-Object {
  $rel = $_.FullName.Substring($root.Length + 1).Replace('\', '/')
  $rel -notmatch '^(\.git|\.claude|tests|test|version1|version2|proev|3d-forsoeg)/' -and $_.Name -notin 'service-worker.js', 'precache-manifest.js' -and
  ($(if ($rel -like 'bygogspil/*') { $rel -match $core } else { $_.Extension -in '.html', '.css', '.png', '.jpg', '.webmanifest', '.js' }))
} | Sort-Object FullName)
$paths = @($files | ForEach-Object { $_.FullName.Substring($root.Length + 1).Replace('\','/') })
$hashes = ($files | ForEach-Object { (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash }) -join ''
$sha = [Security.Cryptography.SHA256]::Create()
$version = ([BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes(($paths -join '|') + $hashes)))).Replace('-','').Substring(0,16)
$json = ConvertTo-Json -InputObject $paths -Compress
[IO.File]::WriteAllText((Join-Path $root 'precache-manifest.js'), "self.MINIMIG_VERSION = '$version';`nself.MINIMIG_FILES = $json;`n", $utf8)
$mb = ($files | Measure-Object Length -Sum).Sum / 1MB
Write-Host ("PWA: {0} files ({1:N1} MB), version {2}" -f $paths.Count, $mb, $version)
