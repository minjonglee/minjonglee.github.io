// Conceptual editorial diagrams. They intentionally contain no measured data.
import fs from 'node:fs';
import path from 'node:path';
import {defaultRoot} from './content.mjs';

const output=path.join(defaultRoot,'assets','schematics');
fs.mkdirSync(output,{recursive:true});
const frame=(title,subtitle,body)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" role="img" aria-label="${title}">
<rect width="1200" height="750" fill="#f8f8f5"/>
<path d="M44 64H1156M44 674H1156" stroke="#cdd5d9" stroke-width="2"/>
<text x="48" y="42" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="2" fill="#15314c">${title}</text>
<text x="1152" y="42" text-anchor="end" font-family="Arial,sans-serif" font-size="16" fill="#667a87">${subtitle}</text>
${body}
<text x="48" y="711" font-family="Arial,sans-serif" font-size="15" fill="#667a87">Conceptual schematic · no experimental data</text>
</svg>\n`;
const diagrams={
  'featured-chiral-synapse.svg':frame('CHIRAL PEROVSKITE SYNAPSE','Helicity · analog states',`
<g fill="none" stroke-width="3"><path d="M168 214c-42 37-43 102-1 139" stroke="#526f8a"/><path d="m154 339 15 14 13-18" stroke="#526f8a"/><path d="M274 350c42-37 43-102 1-139" stroke="#9c4050"/><path d="m288 225-15-14-13 18" stroke="#9c4050"/></g>
<text x="219" y="392" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#15314c">light helicity</text>
<path d="M365 285H427" stroke="#9aabb4" stroke-width="3"/><path d="m416 274 12 11-12 11" fill="none" stroke="#9aabb4" stroke-width="3"/>
<rect x="445" y="185" width="340" height="225" fill="#fff" stroke="#15314c" stroke-width="2"/>
<rect x="463" y="204" width="304" height="42" fill="#e7ebee"/><rect x="463" y="246" width="304" height="122" fill="#e3ebf0"/>
<path d="M492 270h245M492 292h245M492 314h245M492 336h245" stroke="#8ba2b2" stroke-width="2"/>
<path d="M516 265v77M573 265v77M630 265v77M687 265v77" stroke="#a9bcc7" stroke-width="2"/>
<rect x="463" y="368" width="304" height="24" fill="#c7d3d9"/>
<text x="615" y="164" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#15314c">chiral active layer</text>
<path d="M798 285H855" stroke="#9aabb4" stroke-width="3"/><path d="m844 274 12 11-12 11" fill="none" stroke="#9aabb4" stroke-width="3"/>
<g fill="#15314c"><rect x="893" y="330" width="27" height="62"/><rect x="939" y="306" width="27" height="86"/><rect x="985" y="282" width="27" height="110"/><rect x="1031" y="258" width="27" height="134"/><rect x="1077" y="234" width="27" height="158"/></g>
<text x="999" y="426" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#15314c">analog conductance states</text>
<text x="601" y="540" text-anchor="middle" font-family="Arial,sans-serif" font-size="29" fill="#15314c">Helicity-defined state modulation</text>`),
  'featured-hydrogen-synapse.svg':frame('HYDROGEN-BONDED ARTIFICIAL SYNAPSE','PVA · CsPbI₃',`
<rect x="182" y="184" width="572" height="46" fill="#cad5db"/><text x="210" y="214" font-family="Arial,sans-serif" font-size="18" fill="#15314c">Ag / upper contact</text>
<rect x="182" y="232" width="572" height="48" fill="#e9edef"/><text x="210" y="263" font-family="Arial,sans-serif" font-size="18" fill="#15314c">PMMA</text>
<rect x="182" y="282" width="572" height="208" fill="#e0e9ef" stroke="#b3c5d1"/>
<text x="210" y="465" font-family="Arial,sans-serif" font-size="18" fill="#15314c">PVA–CsPbI₃ active layer</text>
<rect x="182" y="492" width="572" height="45" fill="#cad5db"/><text x="210" y="520" font-family="Arial,sans-serif" font-size="18" fill="#15314c">FTO / lower contact</text>
<g stroke="#52708a" stroke-width="2" fill="none"><path d="M260 332h98m-98 42h98m-98 42h98"/><path d="M411 316v116m93-116v116m93-116v116"/></g>
<g fill="#9c4050"><circle cx="358" cy="332" r="6"/><circle cx="358" cy="374" r="6"/><circle cx="358" cy="416" r="6"/></g>
<g stroke="#9c4050" stroke-width="2" stroke-dasharray="5 7"><path d="M366 332h45M366 374h45M366 416h45"/></g>
<text x="807" y="286" font-family="Arial,sans-serif" font-size="18" fill="#15314c">O–H···I⁻ interface</text><path d="M770 335h240" stroke="#b2bec5" stroke-width="2"/>
<text x="807" y="381" font-family="Arial,sans-serif" font-size="18" fill="#15314c">guided ionic motion</text><path d="M770 425h240" stroke="#b2bec5" stroke-width="2"/>
<text x="601" y="606" text-anchor="middle" font-family="Arial,sans-serif" font-size="29" fill="#15314c">Interfacial bonding → stable analog response</text>`),
  'featured-opto-memory.svg':frame('OPTOELECTRONIC MEMRISTOR','TiO₂ interlayer · optical input',`
<path d="M197 210l56 56M225 188l56 56M253 166l56 56" stroke="#9c4050" stroke-width="5"/><path d="m290 218 19 4-3-19" fill="none" stroke="#9c4050" stroke-width="4"/>
<text x="154" y="320" font-family="Arial,sans-serif" font-size="18" fill="#15314c">light</text>
<rect x="359" y="165" width="460" height="62" fill="#d0dbe0"/><rect x="359" y="230" width="460" height="178" fill="#e4edf2" stroke="#9fb3c0"/>
<rect x="359" y="410" width="460" height="32" fill="#a8becb"/><rect x="359" y="445" width="460" height="64" fill="#c7d4dc"/>
<text x="588" y="202" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#15314c">upper contact</text>
<text x="588" y="324" text-anchor="middle" font-family="Arial,sans-serif" font-size="21" fill="#15314c">perovskite</text>
<text x="588" y="433" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" fill="#15314c">TiO₂ interlayer</text>
<text x="588" y="482" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#15314c">lower contact</text>
<g fill="none" stroke="#9c4050" stroke-width="2"><circle cx="437" cy="379" r="16"/><path d="m426 368 22 22m0-22-22 22"/></g><text x="855" y="332" font-family="Arial,sans-serif" font-size="18" fill="#15314c">interfacial trap control</text>
<path d="M837 360h230" stroke="#b2bec5" stroke-width="2"/><text x="855" y="403" font-family="Arial,sans-serif" font-size="18" fill="#15314c">memory + sensing</text>
<text x="601" y="606" text-anchor="middle" font-family="Arial,sans-serif" font-size="29" fill="#15314c">Interface engineering for low-power response</text>`),
  'research-interfaces.svg':frame('INTERFACE PHYSICS','Contacts · defects · ions',`
<rect x="126" y="176" width="944" height="75" fill="#cbd8de"/><rect x="126" y="251" width="944" height="235" fill="#e7eef2"/><rect x="126" y="486" width="944" height="73" fill="#cbd8de"/>
<path d="M126 251H1070M126 486H1070" stroke="#7992a3" stroke-width="2"/>
<g fill="#52708a"><circle cx="230" cy="310" r="10"/><circle cx="355" cy="375" r="10"/><circle cx="491" cy="318" r="10"/><circle cx="640" cy="397" r="10"/><circle cx="802" cy="329" r="10"/><circle cx="963" cy="389" r="10"/></g>
<g fill="none" stroke="#9c4050" stroke-width="3"><circle cx="460" cy="250" r="22"/><path d="M447 237l26 26m0-26-26 26"/><circle cx="775" cy="486" r="22"/><path d="M762 473l26 26m0-26-26 26"/></g>
<path d="M230 310c116 84 160-16 261 8s103 98 149 79 99-114 162-68 112 92 161 60" fill="none" stroke="#52708a" stroke-width="3" stroke-dasharray="12 9"/>
<text x="165" y="210" font-family="Arial,sans-serif" font-size="19" fill="#15314c">contact</text><text x="165" y="534" font-family="Arial,sans-serif" font-size="19" fill="#15314c">thin-film substrate</text>
<text x="602" y="617" text-anchor="middle" font-family="Arial,sans-serif" font-size="27" fill="#15314c">Local environments govern transport pathways</text>`),
  'research-memory.svg':frame('MEMORY &amp; RELIABILITY','State formation · variability',`
<rect x="132" y="170" width="374" height="350" fill="#fff" stroke="#c0ccd3" stroke-width="2"/>
<text x="162" y="215" font-family="Arial,sans-serif" font-size="20" fill="#15314c">device state</text>
<rect x="174" y="258" width="288" height="38" fill="#d6e1e7"/><rect x="174" y="300" width="288" height="128" fill="#e7eef1"/><rect x="174" y="432" width="288" height="38" fill="#c7d5dc"/>
<g fill="#52708a"><circle cx="224" cy="350" r="9"/><circle cx="276" cy="365" r="9"/><circle cx="332" cy="344" r="9"/><circle cx="385" cy="366" r="9"/></g>
<path d="M548 347H633m-16-16 16 16-16 16" stroke="#9c4050" fill="none" stroke-width="3"/>
<rect x="666" y="170" width="406" height="350" fill="#fff" stroke="#c0ccd3" stroke-width="2"/>
<text x="699" y="215" font-family="Arial,sans-serif" font-size="20" fill="#15314c">resolvable states</text>
<g stroke="#52708a" stroke-width="3"><path d="M708 277h310M708 321h310M708 365h310M708 409h310M708 453h310"/></g>
<g fill="#9c4050"><circle cx="736" cy="277" r="5"/><circle cx="908" cy="321" r="5"/><circle cx="823" cy="365" r="5"/><circle cx="977" cy="409" r="5"/><circle cx="761" cy="453" r="5"/></g>
<text x="603" y="616" text-anchor="middle" font-family="Arial,sans-serif" font-size="27" fill="#15314c">Precision depends on state stability</text>`),
  'research-optoelectronics.svg':frame('OPTOELECTRONICS','Photons · interfaces · carriers',`
<g stroke="#9c4050" stroke-width="4"><path d="M222 165v118m55-118v118m55-118v118"/></g><g fill="#9c4050"><path d="m209 269 13 18 13-18"/><path d="m264 269 13 18 13-18"/><path d="m319 269 13 18 13-18"/></g>
<rect x="149" y="316" width="900" height="54" fill="#c8d5dc"/><rect x="149" y="373" width="900" height="40" fill="#a9bdc9"/><rect x="149" y="416" width="900" height="105" fill="#e4ecf0"/><rect x="149" y="524" width="900" height="45" fill="#c8d5dc"/>
<text x="175" y="350" font-family="Arial,sans-serif" font-size="17" fill="#15314c">transparent contact</text><text x="175" y="400" font-family="Arial,sans-serif" font-size="17" fill="#15314c">molecular interface</text><text x="175" y="480" font-family="Arial,sans-serif" font-size="17" fill="#15314c">active layer</text>
<path d="M600 466h298m-15-14 15 14-15 14" stroke="#52708a" fill="none" stroke-width="3"/><text x="730" y="452" font-family="Arial,sans-serif" font-size="17" fill="#15314c">carrier extraction</text>
<text x="601" y="626" text-anchor="middle" font-family="Arial,sans-serif" font-size="27" fill="#15314c">Contact design shapes light-to-charge conversion</text>`),
  'research-flexible.svg':frame('FLEXIBLE ELECTRONICS','Interconnect · deformation',`
<path d="M110 460c150-136 296-136 443 0s294 136 537 0" fill="none" stroke="#dce6e9" stroke-width="106" stroke-linecap="round"/>
<path d="M110 460c150-136 296-136 443 0s294 136 537 0" fill="none" stroke="#52708a" stroke-width="25" stroke-linecap="round"/>
<path d="M110 460c150-136 296-136 443 0s294 136 537 0" fill="none" stroke="#b6cbd4" stroke-width="4" stroke-dasharray="18 16"/>
<g fill="#15314c"><circle cx="208" cy="393" r="22"/><circle cx="551" cy="461" r="22"/><circle cx="920" cy="495" r="22"/></g>
<path d="M406 244c88-36 189-17 246 42" fill="none" stroke="#9c4050" stroke-width="3"/><path d="m636 271 18 16-23 6" fill="none" stroke="#9c4050" stroke-width="3"/>
<text x="545" y="222" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" fill="#15314c">bending</text>
<text x="602" y="630" text-anchor="middle" font-family="Arial,sans-serif" font-size="27" fill="#15314c">Electrical continuity under mechanical strain</text>`),
  'research-integration.svg':frame('FUTURE INTEGRATION','Prospective direction',`
<rect x="130" y="233" width="225" height="236" fill="#fff" stroke="#9fb3bf" stroke-width="2"/><rect x="169" y="283" width="147" height="125" fill="#e5edf1" stroke="#52708a" stroke-width="2"/>
<text x="242" y="516" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" fill="#15314c">device</text>
<path d="M387 351H468m-16-16 16 16-16 16" fill="none" stroke="#9c4050" stroke-width="3" stroke-dasharray="8 7"/>
<rect x="500" y="233" width="225" height="236" fill="#fff" stroke="#9fb3bf" stroke-width="2"/>
<g fill="#dce6eb" stroke="#52708a" stroke-width="1"><rect x="538" y="270" width="42" height="42"/><rect x="591" y="270" width="42" height="42"/><rect x="644" y="270" width="42" height="42"/><rect x="538" y="323" width="42" height="42"/><rect x="591" y="323" width="42" height="42"/><rect x="644" y="323" width="42" height="42"/><rect x="538" y="376" width="42" height="42"/><rect x="591" y="376" width="42" height="42"/><rect x="644" y="376" width="42" height="42"/></g>
<text x="612" y="516" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" fill="#15314c">array</text>
<path d="M757 351H838m-16-16 16 16-16 16" fill="none" stroke="#9c4050" stroke-width="3" stroke-dasharray="8 7"/>
<rect x="870" y="233" width="225" height="236" fill="#fff" stroke="#9fb3bf" stroke-width="2"/><path d="M904 299h157M904 342h157M904 385h157" stroke="#9fb3bf" stroke-width="3"/><circle cx="934" cy="299" r="8" fill="#52708a"/><circle cx="1001" cy="342" r="8" fill="#52708a"/><circle cx="1040" cy="385" r="8" fill="#52708a"/>
<text x="982" y="516" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" fill="#15314c">system</text>
<text x="603" y="628" text-anchor="middle" font-family="Arial,sans-serif" font-size="27" fill="#15314c">From established devices toward integration</text>`)
};
for(const [name,svg] of Object.entries(diagrams)) fs.writeFileSync(path.join(output,name),svg);
console.log(`Wrote ${Object.keys(diagrams).length} conceptual SVG schematics.`);
