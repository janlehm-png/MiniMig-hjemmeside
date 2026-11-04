# Laegger en godkendt version af MiniMig (3D) paa minimig.dk/bygogspil/.
# Kopierer den seneste version-tag (vX.Y.Z) af 3d-forsoeg/ fra app-projektet, saa halvfaerdigt arbejde ikke kommer med -
# kun det, spillet bruger: siden, three.js, figuren, toej, haar, bevaegelser, ikoner og baggrunde. figur.fbx er for
# stor til git og tages fra mappen. Bagefter laver build-pwa.ps1 offline-listen og saetter Til voksne paa siden.
# Nyt prøves foerst paa testsiden med opdater-test.ps1. Se 3d-forsoeg/VERSIONER.md.
# Koer: hoejreklik paa filen -> Koer med PowerShell. Bagefter: GitHub Desktop -> Commit -> Push origin.
# (Afloeser opdater-proev.ps1 fra 03-11-2026: /proev sender nu videre hertil, version 1 ligger skjult i /version1.)
param([string]$App = "$env:USERPROFILE\Documents\Mini-Mig", [string]$Ref = '', [switch]$Test)
$ErrorActionPreference = 'Stop'

# git foelger med GitHub Desktop, ogsaa naar det ikke ligger i PATH
$git = (Get-Command git -ErrorAction SilentlyContinue).Source
if (-not $git) {
  $git = Get-ChildItem "$env:LOCALAPPDATA\GitHubDesktop\app-*\resources\app\git\cmd\git.exe" |
    Sort-Object { [version]($_.FullName -replace '.*\\app-([\d.]+)\\.*', '$1') } -Descending |
    Select-Object -First 1 -ExpandProperty FullName
}
if (-not $git) { throw 'Fandt ikke git. Installer GitHub Desktop.' }

# (testsiden: det seneste commit; den rigtige side: den seneste godkendte version)
if (-not $Ref) { if ($Test) { $Ref = 'HEAD' } else { $Ref = & $git -C $App tag --list 'v*' --sort=-version:refname | Select-Object -First 1 } }
if (-not $Ref) { throw 'Fandt ingen version-tag. Se 3d-forsoeg/VERSIONER.md.' }

$maal = Join-Path $PSScriptRoot $(if ($Test) { 'test' } else { 'bygogspil' })
$tmp = Join-Path $env:TEMP "minimig-bygogspil-$PID"
New-Item -ItemType Directory $tmp | Out-Null
try {
  & $git -C $App archive --format=zip -o "$tmp\v2.zip" $Ref 3d-forsoeg
  if ($LASTEXITCODE) { throw 'git archive fejlede.' }
  Expand-Archive "$tmp\v2.zip" -DestinationPath $tmp
  $kilde = Join-Path $tmp '3d-forsoeg'
  # (kun spillets egne filer - ikke scripts, noter, referencebilleder eller gamle figurer)
  $filer = Get-ChildItem $kilde -Recurse -File | Where-Object {
    $rel = $_.FullName.Substring($kilde.Length + 1).Replace('\', '/')
    $rel -match '^(index\.html|manifest\.webmanifest|three/.*|ikoner/.*|baggrund/.*|[a-z0-9-]+\.(fbx|glb|json|jpg|png))$' -and $rel -notmatch '^(reference|gammel-figur|mixamo-nye|tests)/'
  }
  if (-not ($filer | Where-Object Name -eq 'index.html')) { throw 'Fandt ikke index.html i 3d-forsoeg.' }
  if (Test-Path $maal) { Remove-Item $maal -Recurse -Force }
  foreach ($f in $filer) {
    $rel = $f.FullName.Substring($kilde.Length + 1)
    $ud = Join-Path $maal $rel
    New-Item -ItemType Directory -Force (Split-Path $ud) | Out-Null
    Copy-Item $f.FullName $ud
  }
  Copy-Item (Join-Path $App '3d-forsoeg\figur.fbx') (Join-Path $maal 'figur.fbx')

  $version = & $git -C $App log -1 --format='%h %s' $Ref
  if ($Test) {
    # (testsiden: et TEST-maerke, sine egne gemte figurer og stjerner - ikke boernenes - og ingen soegemaskiner eller offline)
    $side = Join-Path $maal 'index.html'; $html = [IO.File]::ReadAllText($side)
    $html = $html.Replace('minimig3d.', 'minimig-test.').Replace('minimig2.deling', 'minimig-test.deling').Replace('<title>MiniMig version 2</title>', '<title>TEST MiniMig</title>')
    if ($html -notmatch 'name="robots"') { $html = $html.Replace('</head>', '<meta name="robots" content="noindex, nofollow">' + "`n</head>") }
    $kort = & $git -C $App log -1 --format='%h' $Ref
    $tal = [regex]::Match($html, 'name="minimig-version" content="([^"]+)"').Groups[1].Value
    $html = $html.Replace('</body>', "<div style=`"position:fixed;top:4px;left:50%;transform:translateX(-50%);z-index:999;background:#E8384F;color:#fff;font:700 12px system-ui,sans-serif;padding:2px 10px;border-radius:9px;pointer-events:none`">TEST $tal ($kort)</div>`n</body>")
    [IO.File]::WriteAllText($side, $html, (New-Object Text.UTF8Encoding $false))
    Write-Host "test/ opdateret: $version ($($filer.Count + 1) filer)"
  } else {
    & (Join-Path $PSScriptRoot 'build-pwa.ps1')
    Write-Host "bygogspil/ opdateret fra $Ref`: $version ($($filer.Count + 1) filer)"
  }
} finally {
  Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
}
