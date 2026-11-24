# Tekster til hjemmesiden, der skal skiftes SAMMEN med naeste Byg og Spil-udgave (den, hvor knapperne
# kun er piktogrammer uden ord - KID_WORDS=false). Koer fra MiniMig-hjemmeside:  python naeste-udgave-tekster.py
# Ejeren godkendte 24-11-2026. Hver tekst skal findes praecis en gang, ellers stopper skriptet uden at aendre noget.
import sys

R = {
 'index.html': [(
  '<h3>Bogstaver og de første ord</h3><p>Alle knapper har både et billede og et kort dansk ord – Hår, Tøj, Hop, Dans. Billedet hjælper de mindste, og ordet viser vejen til læsning, så barnet begynder at genkende bogstaver og hele ord. Under Navn kan barnet skrive sit eget navn på trøjen, bogstav for bogstav, og høre det læst op.</p>',
  '<h3>Piktogrammer og de første bogstaver</h3><p>Alle knapper er piktogrammer – enkle billeder i den stil, børn kender fra børnehaven – så selv de mindste kan finde rundt uden at kunne læse. Under Navn kan barnet skrive sit eget navn på trøjen, bogstav for bogstav, og høre det læst op.</p>')],
 'en/index.html': [(
  '<h3>Letters and first words</h3><p>Every button has both a picture and a short word – Hair, Clothes, Jump, Dance. The picture helps the youngest, and the word points the way to reading, so your child starts to recognise letters and whole words. Under Name your child can write their own name on the top, letter by letter, and hear it read aloud.</p>',
  '<h3>Pictograms and first letters</h3><p>Every button is a pictogram – a simple picture in the style children know from kindergarten – so even the youngest can find their way without reading. Under Name your child can write their own name on the top, letter by letter, and hear it read aloud.</p>')],
 'til-foraeldre/index.html': [(
  'Det møder <strong>bogstaver og ord</strong>, fordi alle knapper har et kort dansk ord ved billedet, og fordi det kan skrive sit eget navn på trøjen og høre det læst op.',
  'Det finder selv rundt, før det kan læse, fordi alle knapper er <strong>piktogrammer</strong> i den stil, børn kender fra børnehaven. Og det møder <strong>de første bogstaver</strong>, når det skriver sit eget navn på trøjen og hører det læst op.')],
 'en/parents/index.html': [(
  'meets <strong>letters and words</strong> because every button has a short word next to its picture and they can write their own name on the top and hear it read aloud,',
  'finds their own way before they can read because every button is a <strong>pictogram</strong> in the style children know from kindergarten, meets <strong>first letters</strong> when they write their own name on the top and hear it read aloud,')],
}

texts = {}
for f, pairs in R.items():
    s = open(f, encoding='utf-8', newline='').read()
    for old, new in pairs:
        if s.count(old) != 1:
            sys.exit(f'STOP: teksten findes {s.count(old)} gange i {f} - intet er aendret')
        s = s.replace(old, new)
    texts[f] = s
for f, s in texts.items():
    open(f, 'w', encoding='utf-8', newline='').write(s)
print('Hjemmesidens tekster om piktogrammer er skiftet:', ', '.join(texts))
