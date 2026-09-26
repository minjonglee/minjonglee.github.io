"""Optional PDF export. The website itself needs no Python dependencies."""
import argparse
import json
import os
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether, CondPageBreak

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description='Export the public CV from content.js')
parser.add_argument('--font-regular', default=os.path.join(os.environ.get('WINDIR', r'C:\Windows'), 'Fonts', 'malgun.ttf'))
parser.add_argument('--font-bold', default=os.path.join(os.environ.get('WINDIR', r'C:\Windows'), 'Fonts', 'malgunbd.ttf'))
args = parser.parse_args()
for p in [args.font_regular, args.font_bold]:
    if not Path(p).is_file():
        raise SystemExit('Provide Korean-capable TrueType fonts using --font-regular and --font-bold.')
pdfmetrics.registerFont(TTFont('CV', args.font_regular))
pdfmetrics.registerFont(TTFont('CV-Bold', args.font_bold))
pdfmetrics.registerFontFamily('CV', normal='CV', bold='CV-Bold', italic='CV', boldItalic='CV-Bold')
source = (ROOT/'content.js').read_text(encoding='utf-8')
data = json.loads(source.split('window.SITE_CONTENT =', 1)[1].strip().removesuffix(';'))
ink=colors.HexColor('#232420')
muted=colors.HexColor('#62635c')
styles = {
    'title': ParagraphStyle('title', fontName='CV-Bold', fontSize=26, leading=32, textColor=ink, spaceAfter=13),
    'body': ParagraphStyle('body', fontName='CV', fontSize=8.7, leading=13.5, textColor=ink, spaceAfter=8),
    'heading': ParagraphStyle('heading', fontName='CV-Bold', fontSize=10.5, leading=16, textColor=ink, spaceBefore=19, spaceAfter=10, keepWithNext=True),
    'small': ParagraphStyle('small', fontName='CV', fontSize=7.4, leading=11.5, textColor=muted, spaceAfter=9),
}
def esc(text):
    return escape(str(text).replace('–','-').replace('—','-').replace('‑','-').replace('→','to'))
def para(text, style='body'):
    return Paragraph(text, styles[style])
def heading(text):
    flow.append(CondPageBreak(45*mm))
    flow.append(para(esc(text).upper(),'heading'))
def author(text):
    return esc(text).replace('Min Jong Lee','<b>Min Jong Lee</b>')
flow=[]
profile=data['profile']
flow.append(para('MIN JONG LEE','title'))
flow.append(para('School of Electrical Engineering, Korea University<br/>Seoul, Republic of Korea<br/><link href="mailto:'+profile['email']+'">'+profile['email']+'</link> | <link href="https://minjonglee.github.io/">minjonglee.github.io</link> | <link href="'+escape(data['scholar'], {'"':'&quot;'})+'">Google Scholar</link>'))
flow.append(para('Public curriculum vitae | Record updated '+esc(profile['updated']),'small'))
heading('Research identity')
flow.append(para('<b>Interface and device physics for emerging electronics</b>'))
flow.append(para('Research interests: molecular and thin-film interfaces, defects, ionic dynamics, charge transport, emerging memory, optoelectronics, and flexible-device collaborations. Integrated and 3D electronics is a future research direction.'))
heading('Education')
flow.append(para('<b>'+esc(profile['education']['degree'])+'</b> | '+esc(profile['education']['period'])+'<br/>'+esc(profile['education']['school'])+'<br/>Advisor: '+esc(profile['advisor'])))

published=[p for p in data['publications'] if not p.get('status')]
heading('First-author publications')
number=0
for group in ['first','co']:
    if group=='co': heading('Co-authored publications')
    for p in sorted([p for p in published if p['type']==group],key=lambda p:-p['year']):
        number+=1
        text=f'<b>{number}.</b> {author(p["authors"])}. “{esc(p["title"])}.” <b>{esc(p["journal"])}</b> ({p["year"]}).'
        if p.get('doi'): text+=' <link href="https://doi.org/'+p['doi']+'">doi:'+esc(p['doi'])+'</link>'
        flow.append(KeepTogether([para(text),Spacer(1,3)]))
heading('Manuscript in revision')
for p in data['publications']:
    if p.get('status'):
        flow.append(para(author(p['authors'])+'. “'+esc(p['title'])+'.” '+esc(p['journal'])+' ('+str(p['year'])+'). <b>'+esc(p['status'])+'; not published.</b>'))
heading('Patents')
for i,p in enumerate(data['patents'],1):
    title=f'<b>{i}. {esc(p["englishTitle"])}</b>'
    original=esc(p['title'])
    facts=esc(p['inventors'])+'<br/>'+esc(p['status'])+' | '+esc(p['jurisdiction'])+' | '+esc(p['number'])+' | '+esc(p['date'])
    if p.get('territoryNote'): facts+='<br/>'+esc(p['territoryNote'])
    flow.append(KeepTogether([para(title),para(original,'small'),para(facts),Spacer(1,3)]))
heading('Research projects')
for p in data['projects']:
    text='<b>'+esc(p['englishTitle'])+'</b><br/>'+esc(p['title'])+'<br/>'+esc(p['sponsor'])+' | '+esc(p['period'])
    if p.get('personalRole'): text+=' | '+esc(p['personalRole'])
    flow.append(KeepTogether([para(text),Spacer(1,3)]))
heading('Awards & academic programs')
for p in sorted(data['awards'],key=lambda p:-int(p['year'])):
    flow.append(KeepTogether([para('<b>'+p['year']+' | '+esc(p['englishTitle'])+'</b><br/>'+esc(p['title'])),Spacer(1,2)]))
flow.append(Spacer(1,15))
flow.append(para('Source: user-supplied CV updated September 2, 2026. English labels for Korean titles are descriptive translations. Project periods refer to the programs listed in the CV. Author symbols: † equal contribution; * corresponding author. Original phone number and detailed postal address omitted.','small'))

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#d5d4cb'))
    canvas.line(18*mm,16*mm,192*mm,16*mm)
    canvas.setFont('CV',7)
    canvas.setFillColor(muted)
    canvas.drawString(18*mm,11*mm,'Min Jong Lee | Curriculum vitae')
    canvas.drawRightString(192*mm,11*mm,str(doc.page))
    canvas.restoreState()

out=ROOT/'assets'/'min-jong-lee-cv.pdf'
out.parent.mkdir(exist_ok=True)
doc=SimpleDocTemplate(str(out),pagesize=(210*mm,297*mm),rightMargin=18*mm,leftMargin=18*mm,topMargin=18*mm,bottomMargin=23*mm,title='Min Jong Lee - Public Curriculum Vitae',author='Min Jong Lee')
doc.build(flow,onFirstPage=footer,onLaterPages=footer)
print(f'Created {out}')
