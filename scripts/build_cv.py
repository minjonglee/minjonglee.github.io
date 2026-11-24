"""Optional PDF export. The website itself needs no Python dependencies."""
import argparse
import json
import os
import re
from datetime import date
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether, CondPageBreak

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description='Export the public CV from Pages CMS JSON content')
parser.add_argument('--font-regular', default=os.path.join(os.environ.get('WINDIR', r'C:\Windows'), 'Fonts', 'malgun.ttf'))
parser.add_argument('--font-bold', default=os.path.join(os.environ.get('WINDIR', r'C:\Windows'), 'Fonts', 'malgunbd.ttf'))
parser.add_argument('--generated-date', default=date.today().isoformat(), help='YYYY-MM-DD date shown on the public PDF')
args = parser.parse_args()
try:
    generated_date = date.fromisoformat(args.generated_date)
except ValueError as exc:
    raise SystemExit('--generated-date must be YYYY-MM-DD') from exc
for p in [args.font_regular, args.font_bold]:
    if not Path(p).is_file():
        raise SystemExit('Provide Korean-capable TrueType fonts using --font-regular and --font-bold.')
pdfmetrics.registerFont(TTFont('CV', args.font_regular))
pdfmetrics.registerFont(TTFont('CV-Bold', args.font_bold))
pdfmetrics.registerFontFamily('CV', normal='CV', bold='CV-Bold', italic='CV', boldItalic='CV-Bold')
def collection(name):
    records = [json.loads(file.read_text(encoding='utf-8')) for file in (ROOT/'content'/name).glob('*.json')]
    return sorted([record for record in records if record.get('visible', True)], key=lambda record: (record.get('order', 999), record.get('id', '')))
data = {
    'profile': json.loads((ROOT/'content'/'profile.json').read_text(encoding='utf-8')),
    'education': collection('education'),
    'publications': collection('publications'),
    'patents': collection('patents'),
    'projects': collection('projects'),
    'awards': collection('awards'),
}
data['scholar'] = data['profile']['scholar']
data['patents'].sort(key=lambda p: (p.get('sortDate',''), p.get('id','')), reverse=True)
ink=colors.HexColor('#232420')
muted=colors.HexColor('#62635c')
styles = {
    'title': ParagraphStyle('title', fontName='CV-Bold', fontSize=26, leading=32, textColor=ink, spaceAfter=13),
    'body': ParagraphStyle('body', fontName='CV', fontSize=8.7, leading=13, textColor=ink, spaceAfter=5),
    'heading': ParagraphStyle('heading', fontName='CV-Bold', fontSize=10.5, leading=16, textColor=ink, spaceBefore=19, spaceAfter=10, keepWithNext=True),
    'small': ParagraphStyle('small', fontName='CV', fontSize=7.4, leading=11.5, textColor=muted, spaceAfter=9),
}
SUBSCRIPT_DIGITS = str.maketrans('₀₁₂₃₄₅₆₇₈₉', '0123456789')
def esc(text):
    return escape(str(text).translate(SUBSCRIPT_DIGITS).replace('–','-').replace('—','-').replace('‑','-').replace('→','to'))
def para(text, style='body'):
    return Paragraph(text, styles[style])
def heading(text):
    flow.append(CondPageBreak(45*mm))
    flow.append(para(esc(text).upper(),'heading'))
def author(text):
    return esc(text).replace('Min Jong Lee','<b>Min Jong Lee</b>')

def patent_country(value):
    name=str(value or '').strip()
    return {'Korea':'KR','China':'CN','Taiwan':'TW','United States':'US'}.get(name,name)
flow=[]
profile=data['profile']
flow.append(para('MIN JONG LEE','title'))
flow.append(para('School of Electrical Engineering, Korea University<br/>Seoul, Republic of Korea<br/><link href="mailto:'+profile['email']+'">'+profile['email']+'</link> | <link href="https://minjonglee.github.io/">minjonglee.github.io</link> | <link href="'+escape(data['scholar'], {'"':'&quot;'})+'">Google Scholar</link>'))
flow.append(para('Public curriculum vitae | Record updated '+esc(profile['updated']),'small'))
heading('Research identity')
flow.append(para('<b>Interface and device physics for emerging electronics</b>'))
flow.append(para('Research interests: molecular and thin-film interfaces, defects, ionic dynamics, charge transport, emerging memory, optoelectronics, and flexible-device R&amp;D. Integrated electronic systems are a long-term research direction.'))
heading('Education')
for item in data['education']:
    details='<b>'+esc(item['degree'])+'</b> | '+esc(item.get('period',''))+'<br/>'+esc(item['school'])
    if item.get('gpa'): details+='<br/>GPA: '+esc(item['gpa'])
    if item.get('honor'): details+=(' | ' if item.get('gpa') else '<br/>')+esc(item['honor'])
    if item.get('advisor'): details+='<br/>Advisor: '+esc(item['advisor'])
    flow.append(para(details))

published=[p for p in data['publications'] if p.get('publicationStatus',p.get('status','Published')) in {'Accepted','In Press','ASAP','Early View','Online Published','Published'}]
published.sort(key=lambda p: (p.get('sortDate',''),p.get('id','')), reverse=True)
heading('Publications')
for number,p in enumerate(published,1):
    status = p.get('publicationStatus',p.get('status','Published'))
    details = [str(p['year']) + (f' ({status})' if status != 'Published' else '')]
    if p.get('volume'): details.append('Vol. ' + str(p['volume']))
    if p.get('issue'): details.append('Issue ' + str(p['issue']))
    pages = f"{p['startPage']}-{p['endPage']}" if p.get('startPage') and p.get('endPage') else p.get('pages')
    if pages: details.append('pp. ' + str(pages))
    if p.get('articleNumber'): details.append('Article ' + str(p['articleNumber']))
    if p.get('eLocationId'): details.append('eLocation ' + str(p['eLocationId']))
    role = 'Co-first author (equal contribution)' if p.get('coFirstAuthor') else 'First author' if p.get('firstAuthor') or p.get('type') == 'first' else ''
    text=f'<b>{number}.</b> {author(p["authors"])}. “{esc(p["title"])}.” <b>{esc(p.get("journalName") or p.get("journal", ""))}</b> ({esc(" · ".join(details))}).'
    if role: text += ' <b>[' + esc(role) + ']</b>'
    doi_value = p.get('doi', '')
    doi_url = p.get('doiUrl') or (doi_value if doi_value.startswith(('http://', 'https://')) else 'https://doi.org/' + doi_value if doi_value else '')
    if doi_url:
        match = re.search(r'10\.\d{4,9}/[^?#\s]+', doi_value or doi_url)
        doi_label = 'doi:' + match.group(0) if match else 'DOI'
        text += ' <link href="' + esc(doi_url) + '">' + esc(doi_label) + '</link>'
    flow.append(KeepTogether([para(text),Spacer(1,2)]))
heading('Patents')
for i,p in enumerate(data['patents'],1):
    title=f'<b>{i}. {esc(p.get("englishTitle") or p["title"])}</b>'
    original=esc(p['title'])
    registered=p['status'] in {'Registered','Granted'}
    number_label='Registration number' if registered else 'Application number'
    identifier=p.get('registrationNumber') or p.get('applicationNumber') or p.get('number','')
    record_date=p.get('registrationDate') or p.get('applicationDate') or p.get('date','')
    country=patent_country(p.get('country') or p.get('jurisdiction'))
    codes=list(dict.fromkeys(patent_country(value) for value in [p.get('country'),*re.split(r'\s*[·,]\s*',p.get('jurisdiction',''))] if value))
    overseas=[code for code in codes if code!='KR']
    facts=esc(p['inventors'])+'<br/>'+esc(p['status'])+' | '+esc(country)+' | '+esc(number_label)+': '+esc(identifier)+' | '+esc(record_date)
    if registered and p.get('applicationNumber'):
        facts+='<br/>Application number: '+esc(p['applicationNumber'])+' | '+esc(p.get('applicationDate',''))
    if len(codes)>1 and overseas: facts+='<br/>Overseas jurisdictions: '+esc(' · '.join(overseas))
    flow.append(KeepTogether([para(title),para(original,'small'),para(facts),Spacer(1,3)]))
heading('Research projects')
for p in data['projects']:
    text='<b>'+esc(p['englishTitle'])+'</b><br/>'+esc(p['title'])+'<br/>'+esc(p['sponsor'])+' | Program period: '+esc(p['period'])
    if p.get('personalRole'): text+=' | Role: '+esc(p['personalRole'])
    if p.get('personalParticipationPeriod'): text+='<br/>My participation: '+esc(p['personalParticipationPeriod'])
    flow.append(KeepTogether([para(text)]))
    flow.append(Spacer(1,7))
heading('Awards & academic programs')
for p in sorted(data['awards'],key=lambda p:-int(p['year'])):
    flow.append(KeepTogether([para('<b>'+p['year']+' | '+esc(p['englishTitle'])+'</b><br/>'+esc(p['title'])),Spacer(1,2)]))
flow.append(Spacer(1,15))
flow.append(para('Generated ' + generated_date.strftime('%d %B %Y') + ' from the same content records as the web CV. Project dates are official program periods, not individual participation dates. English labels for Korean titles are descriptive translations. Author symbols: † equal contribution; * corresponding author. Phone number and detailed postal address omitted.','small'))

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
