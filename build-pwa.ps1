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

# What is kept for use without internet (since 0.12.0, tried on /test from 05-11-2026: with only 25 MB kept, moves,
# clothes and hair were missing without internet). First, before the game is called ready: the website's own pages and
# pictures, and of the game the page, three.js, the figure, all its moves, the monkey in Straffespark, the icons and the
# backgrounds. The rest of the game - clothes, hair, hats, pets - pwa.js fetches one at a time afterwards. Each file is
# kept under its own hash, so a new version fetches only what changed. Version 1, the old addresses that only send on,
# the test page and the tests are left out
$core = '^bygogspil/(index\.html|manifest\.webmanifest|three/.*|ikoner/.*|baggrund/.*|figur\.fbx|figur-farve\.jpg|figur-[a-z0-9-]+\.json|dyr-abe\.(glb|jpg)|haar-kort\.(json|jpg))$'
$files = @(Get-ChildItem -LiteralPath $root -Recurse -File | Where-Object {
  $rel = $_.FullName.Substring($root.Length + 1).Replace('\', '/')
  $rel -notmatch '^(\.git|\.claude|tests|test|pwa-naeste|version1|version2|proev|3d-forsoeg)/' -and $_.Name -notin 'service-worker.js', 'precache-manifest.js' -and
  ($rel -like 'bygogspil/*' -or $_.Extension -in '.html', '.css', '.png', '.jpg', '.webmanifest', '.js')
} | Sort-Object FullName)
$hashes = [ordered]@{}; $must = @(); $rest = @(); $mustSize = 0; $allSize = 0
foreach ($f in $files) {
  $rel = $f.FullName.Substring($root.Length + 1).Replace('\', '/')
  $hashes[$rel] = (Get-FileHash -LiteralPath $f.FullName -Algorithm SHA256).Hash.Substring(0, 16); $allSize += $f.Length
  if ($rel -notlike 'bygogspil/*' -or $rel -match $core) { $must += $rel; $mustSize += $f.Length } else { $rest += $rel }
}
$sha = [Security.Cryptography.SHA256]::Create()
$version = ([BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes(($hashes.Values -join ''))))).Replace('-', '').Substring(0, 16)
$out = "self.MINIMIG_VERSION = '$version';`nself.MINIMIG_GAME = 'bygogspil';`nself.MINIMIG_FILES = $(ConvertTo-Json -InputObject $must -Compress);`nself.MINIMIG_REST = $(ConvertTo-Json -InputObject $rest -Compress);`nself.MINIMIG_HASHES = $(ConvertTo-Json -InputObject $hashes -Compress);`n"
[IO.File]::WriteAllText((Join-Path $root 'precache-manifest.js'), $out, $utf8)
# (Safari looks only at service-worker.js itself for a new version, not at what it loads - so the iPads never got a new
# game: the version goes into its importScripts line, so the file changes with every version. Tried on /test 05-11-2026)
$sw = Join-Path $root 'service-worker.js'; [IO.File]::WriteAllText($sw, ([IO.File]::ReadAllText($sw) -replace "importScripts\('\./precache-manifest\.js(\?v=[0-9A-F]+)?'\);", "importScripts('./precache-manifest.js?v=$version');"), $utf8)
Write-Host ("PWA: {0} files first ({1:N1} MB), {2} afterwards ({3:N1} MB in all), version {4}" -f $must.Count, ($mustSize / 1MB), $rest.Count, ($allSize / 1MB), $version)
