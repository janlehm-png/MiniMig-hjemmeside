# Goer testsiden minimig.dk/test/ klar til brug uden internet med sin egen service worker, saa det kan proeves paa iPad,
# foer det rigtige spil roeres. Koeres af opdater-test.ps1. Filerne i pwa-naeste/ er den kommende service-worker.js og pwa.js.
$ErrorActionPreference = 'Stop'
$utf8 = New-Object Text.UTF8Encoding $false
$site = $PSScriptRoot
$root = Join-Path $site 'test'
foreach ($f in 'service-worker.js', 'pwa.js') { Copy-Item -LiteralPath (Join-Path $site "pwa-naeste\$f") -Destination (Join-Path $root $f) -Force }
Copy-Item -LiteralPath (Join-Path $site 'pwa.css') -Destination (Join-Path $root 'pwa.css') -Force
$side = Join-Path $root 'index.html'; $html = [IO.File]::ReadAllText($side)
if ($html -notmatch 'src="pwa\.js"') { $html = $html.Replace('</head>', '<link rel="stylesheet" href="pwa.css"><script src="pwa.js" defer></script>' + "`n</head>") }
[IO.File]::WriteAllText($side, $html, $utf8)
# (skal vaere der, foer spillet kaldes klar: figuren, alle bevaegelser, aben i Straffespark, ikoner og baggrunde; resten
# - toej, haar, hatte, kaeledyr - henter pwa.js bagefter)
$core = '^(index\.html|pwa\.js|pwa\.css|manifest\.webmanifest|three/.*|ikoner/.*|baggrund/.*|figur\.fbx|figur-farve\.jpg|figur-[a-z0-9-]+\.json|dyr-abe\.(glb|jpg)|haar-kort\.(json|jpg))$'
$all = @(Get-ChildItem -LiteralPath $root -Recurse -File | Where-Object { $_.Name -notin 'service-worker.js', 'precache-manifest.js' } | Sort-Object FullName)
$hashes = [ordered]@{}; $must = @(); $rest = @(); $mustSize = 0
foreach ($f in $all) {
  $rel = $f.FullName.Substring($root.Length + 1).Replace('\', '/')
  $hashes[$rel] = (Get-FileHash -LiteralPath $f.FullName -Algorithm SHA256).Hash.Substring(0, 16)
  if ($rel -match $core) { $must += $rel; $mustSize += $f.Length } else { $rest += $rel }
}
$sha = [Security.Cryptography.SHA256]::Create()
$version = ([BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes(($hashes.Values -join ''))))).Replace('-', '').Substring(0, 16)
$out = "self.MINIMIG_VERSION = '$version';`nself.MINIMIG_GAME = 'test';`nself.MINIMIG_FILES = $(ConvertTo-Json -InputObject $must -Compress);`nself.MINIMIG_REST = $(ConvertTo-Json -InputObject $rest -Compress);`nself.MINIMIG_HASHES = $(ConvertTo-Json -InputObject $hashes -Compress);`n"
[IO.File]::WriteAllText((Join-Path $root 'precache-manifest.js'), $out, $utf8)
# (Safari ser kun paa selve service-worker.js, naar den leder efter en ny version - ikke paa filer den henter ind - saa iPad'en
# fik aldrig den nye. Versionsnummeret i dens foerste linje goer den til en ny fil hver gang)
$sw = Join-Path $root 'service-worker.js'; [IO.File]::WriteAllText($sw, [IO.File]::ReadAllText($sw).Replace("importScripts('./precache-manifest.js');", "importScripts('./precache-manifest.js?v=$version');"), $utf8)
Write-Host ("Testside: {0} filer foerst ({1:N1} MB), {2} bagefter, version {3}" -f $must.Count, ($mustSize / 1MB), $rest.Count, $version)
