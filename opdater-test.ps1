# Laegger det seneste commit af MiniMig paa testsiden minimig.dk/test/ (se 3d-forsoeg/VERSIONER.md).
# Koer: hoejreklik paa filen -> Koer med PowerShell. Bagefter: GitHub Desktop -> Commit -> Push origin.
param([string]$App = "$env:USERPROFILE\Documents\Mini-Mig", [string]$Ref = 'HEAD')
& (Join-Path $PSScriptRoot 'opdater-bygogspil.ps1') -App $App -Ref $Ref -Test
