"""
Fill content into slides 2-7 of the PayShield presentation.
Each slide gets a content text box added into spTree before </p:spTree>.
"""

import re

BASE = r"c:\idea\unpacked_template\ppt\slides"

def make_content_sp(shape_id, x, y, cx, cy, paragraphs):
    """
    Build a <p:sp> XML block with multiple paragraphs.
    paragraphs: list of dicts with keys:
        text: str
        bold: bool
        size: int (hundredths of pt, e.g. 1800 = 18pt)
        indent: bool (add bullet indent)
        color: str hex (default "272525")
        break_after: bool
    """
    runs = []
    for i, p in enumerate(paragraphs):
        color = p.get("color", "FFFFFF")
        sz = p.get("size", 1600)
        bold_attr = ' b="1"' if p.get("bold") else ''
        indent = p.get("indent", False)
        break_after = p.get("break_after", True)

        if indent:
            ppr = '<a:pPr marL="342900" indent="-342900" algn="l"><a:lnSpc><a:spcPts val="1800"/></a:lnSpc><a:buChar char="&#x2013;"/></a:pPr>'
        else:
            ppr = '<a:pPr algn="l"><a:lnSpc><a:spcPts val="1800"/></a:lnSpc><a:buNone/></a:pPr>'

        text = p["text"].replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

        run = f"""      <a:p>
        {ppr}
        <a:r>
          <a:rPr lang="en-US" sz="{sz}"{bold_attr} dirty="0">
            <a:solidFill><a:srgbClr val="{color}"/></a:solidFill>
            <a:latin typeface="Lato" pitchFamily="34" charset="0"/>
          </a:rPr>
          <a:t>{text}</a:t>
        </a:r>
      </a:p>"""
        runs.append(run)

    paras = "\n".join(runs)

    return f"""      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="{shape_id}" name="Content{shape_id}"/>
          <p:cNvSpPr/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="{x}" y="{y}"/>
            <a:ext cx="{cx}" cy="{cy}"/>
          </a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:noFill/>
          <a:ln/>
        </p:spPr>
        <p:txBody>
          <a:bodyPr wrap="square" lIns="91402" tIns="91402" rIns="91402" bIns="91402" rtlCol="0" anchor="t"/>
          <a:lstStyle/>
{paras}
        </p:txBody>
      </p:sp>"""


def inject_sp(slide_path, sp_xml):
    with open(slide_path, "r", encoding="utf-8") as f:
        content = f.read()
    # Insert before </p:spTree>
    content = content.replace("    </p:spTree>", sp_xml + "\n    </p:spTree>", 1)
    with open(slide_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  Done: {slide_path}")


# ─────────────────────────────────────────────
# SLIDE 2 — SDG Goal
# Content area: right side, below header bar
# The header takes top ~1447px (EMU: ~1447801)
# Slide height: 8229600 EMU. Content from y=1600000
# Right column: x=7800000, cx=6400000
# ─────────────────────────────────────────────
slide2_paras = [
    {"text": "SDG 9: Industry, Innovation & Infrastructure", "bold": True, "size": 2200, "color": "FFFFFF"},
    {"text": "", "size": 900, "color": "FFFFFF"},
    {"text": "Promotes secure digital financial systems", "indent": True, "size": 1600, "color": "FFFFFF"},
    {"text": "Enhances trust in digital payment infrastructure", "indent": True, "size": 1600, "color": "FFFFFF"},
    {"text": "Reduces financial fraud risks in emerging economies", "indent": True, "size": 1600, "color": "FFFFFF"},
    {"text": "", "size": 900, "color": "FFFFFF"},
    {"text": "India processes 14 billion+ UPI transactions/year.", "bold": True, "size": 1400, "color": "FFD966"},
    {"text": "Securing this infrastructure is a development imperative.", "size": 1400, "color": "FFD966"},
]
sp2 = make_content_sp(30, 7800000, 1600000, 6400000, 5900000, slide2_paras)
inject_sp(f"{BASE}/slide2.xml", sp2)


# ─────────────────────────────────────────────
# SLIDE 3 — Problem Statement
# ─────────────────────────────────────────────
slide3_paras = [
    {"text": "The Gap in Current Systems", "bold": True, "size": 2000, "color": "FFFFFF"},
    {"text": "", "size": 800, "color": "FFFFFF"},
    {"text": "Rapid adoption of UPI and digital payments has increased financial fraud", "indent": True, "size": 1500, "color": "FFFFFF"},
    {"text": "", "size": 600, "color": "FFFFFF"},
    {"text": "Users fall victim to:", "bold": True, "size": 1500, "color": "FFFFFF"},
    {"text": "Phishing attacks and fake payment links", "indent": True, "size": 1500, "color": "FFFFFF"},
    {"text": "Fake payment requests (send vs receive confusion)", "indent": True, "size": 1500, "color": "FFFFFF"},
    {"text": "Social engineering and urgency-based scams", "indent": True, "size": 1500, "color": "FFFFFF"},
    {"text": "", "size": 600, "color": "FFFFFF"},
    {"text": "Existing systems detect fraud — but fail to stop users at the moment of decision.", "bold": True, "size": 1500, "color": "FFD966"},
    {"text": "", "size": 600, "color": "FFFFFF"},
    {"text": "Current systems detect scams. They do not prevent bad decisions.", "bold": True, "size": 1600, "color": "FFD966"},
]
sp3 = make_content_sp(30, 7800000, 1600000, 6400000, 6200000, slide3_paras)
inject_sp(f"{BASE}/slide3.xml", sp3)


# ─────────────────────────────────────────────
# SLIDE 7 (file: slide7.xml) — Why Existing Solutions Fail
# ─────────────────────────────────────────────
slide7_paras = [
    {"text": "Why Existing Solutions Fail", "bold": True, "size": 2000, "color": "FFFFFF"},
    {"text": "", "size": 800, "color": "FFFFFF"},
    {"text": "Current systems rely solely on warnings", "indent": True, "size": 1600, "color": "FFFFFF"},
    {"text": "Users ignore warnings due to trust in the scammer", "indent": True, "size": 1600, "color": "FFFFFF"},
    {"text": "No system checks the user's logical intent", "indent": True, "size": 1600, "color": "FFFFFF"},
    {"text": "No intervention at the decision psychology level", "indent": True, "size": 1600, "color": "FFFFFF"},
    {"text": "", "size": 800, "color": "FFFFFF"},
    {"text": "The intervention must happen BEFORE the decision —", "bold": True, "size": 1600, "color": "FFD966"},
    {"text": "not after the transaction.", "bold": True, "size": 1600, "color": "FFD966"},
]
sp7 = make_content_sp(30, 7800000, 1600000, 6400000, 6000000, slide7_paras)
# Update the title on slide7 (it inherited "PROBLEM STATEMENT" from slide3)
slide7_path = f"{BASE}/slide7.xml"
inject_sp(slide7_path, sp7)

# Fix title in slide7
with open(slide7_path, "r", encoding="utf-8") as f:
    s = f.read()
s = s.replace("<a:t>PROBLEM STATEMENT</a:t>", "<a:t>WHY EXISTING SOLUTIONS FAIL</a:t>")
with open(slide7_path, "w", encoding="utf-8") as f:
    f.write(s)
print("  Fixed title on slide7")


# ─────────────────────────────────────────────
# SLIDE 4 — Methodology
# ─────────────────────────────────────────────
slide4_paras = [
    {"text": "Step 1: Context Capture", "bold": True, "size": 1600, "color": "FFD966"},
    {"text": "Analyze user interaction — QR, messages, payment screen", "indent": True, "size": 1450, "color": "FFFFFF"},
    {"text": "", "size": 600, "color": "FFFFFF"},
    {"text": "Step 2: Intent Detection", "bold": True, "size": 1600, "color": "FFD966"},
    {"text": "Identify whether user intends to send or receive money", "indent": True, "size": 1450, "color": "FFFFFF"},
    {"text": "", "size": 600, "color": "FFFFFF"},
    {"text": "Step 3: Risk Scoring", "bold": True, "size": 1600, "color": "FFD966"},
    {"text": "Detect scam patterns — urgency, unknown contact, mismatch", "indent": True, "size": 1450, "color": "FFFFFF"},
    {"text": "", "size": 600, "color": "FFFFFF"},
    {"text": "Step 4: Behavioral Intervention", "bold": True, "size": 1600, "color": "FFD966"},
    {"text": "Show contradiction-based prompts + adaptive delay", "indent": True, "size": 1450, "color": "FFFFFF"},
    {"text": "", "size": 600, "color": "FFFFFF"},
    {"text": "Step 5: Decision Reinforcement", "bold": True, "size": 1600, "color": "FFD966"},
    {"text": "Force user to re-confirm intent with clarity", "indent": True, "size": 1450, "color": "FFFFFF"},
]
sp4 = make_content_sp(30, 7800000, 1600000, 6400000, 6400000, slide4_paras)
inject_sp(f"{BASE}/slide4.xml", sp4)


# ─────────────────────────────────────────────
# SLIDE 5 — Solution & Expected Outcome (two-column feel)
# ─────────────────────────────────────────────
slide5_paras = [
    {"text": "Solution", "bold": True, "size": 1900, "color": "FFD966"},
    {"text": "Real-time overlay system during payment transaction", "indent": True, "size": 1450, "color": "FFFFFF"},
    {"text": "Detects intent mismatch (send vs receive confusion)", "indent": True, "size": 1450, "color": "FFFFFF"},
    {"text": "Uses behavioral nudges instead of blocking", "indent": True, "size": 1450, "color": "FFFFFF"},
    {"text": "Works without bank integration", "indent": True, "size": 1450, "color": "FFFFFF"},
    {"text": "", "size": 600, "color": "FFFFFF"},
    {"text": "Expected Outcome", "bold": True, "size": 1900, "color": "FFD966"},
    {"text": "Reduction in scam success rate", "indent": True, "size": 1450, "color": "FFFFFF"},
    {"text": "Improved user decision-making under pressure", "indent": True, "size": 1450, "color": "FFFFFF"},
    {"text": "Minimal friction for safe, legitimate transactions", "indent": True, "size": 1450, "color": "FFFFFF"},
    {"text": "Effective even for low-awareness users", "indent": True, "size": 1450, "color": "FFFFFF"},
]
sp5 = make_content_sp(30, 7800000, 1700000, 6400000, 6100000, slide5_paras)
inject_sp(f"{BASE}/slide5.xml", sp5)


# ─────────────────────────────────────────────
# SLIDE 6 — Flow Chart (text-based flow)
# ─────────────────────────────────────────────
slide6_paras = [
    {"text": "User Initiates Payment", "bold": True, "size": 1500, "color": "FFFFFF"},
    {"text": "▼", "size": 1200, "color": "FFD966"},
    {"text": "Context Analysis  (QR / Message / Contact)", "bold": True, "size": 1500, "color": "FFFFFF"},
    {"text": "▼", "size": 1200, "color": "FFD966"},
    {"text": "Intent Detection  (Send vs Receive)", "bold": True, "size": 1500, "color": "FFFFFF"},
    {"text": "▼", "size": 1200, "color": "FFD966"},
    {"text": "Risk Scoring", "bold": True, "size": 1500, "color": "FFFFFF"},
    {"text": "▼", "size": 1200, "color": "FFD966"},
    {"text": "Risk Low  →  Proceed Normally", "bold": True, "size": 1400, "color": "7ED957"},
    {"text": "Risk High  →  Trigger Intervention", "bold": True, "size": 1400, "color": "FF6B6B"},
    {"text": "▼", "size": 1200, "color": "FFD966"},
    {"text": "Contradiction Prompt + Adaptive Delay", "bold": True, "size": 1500, "color": "FFFFFF"},
    {"text": "▼", "size": 1200, "color": "FFD966"},
    {"text": "User Reconfirms Decision", "bold": True, "size": 1500, "color": "FFFFFF"},
    {"text": "▼", "size": 1200, "color": "FFD966"},
    {"text": "Transaction Completed", "bold": True, "size": 1500, "color": "7ED957"},
]
sp6 = make_content_sp(30, 7800000, 1600000, 6400000, 6400000, slide6_paras)
inject_sp(f"{BASE}/slide6.xml", sp6)

print("\nAll slides filled successfully!")
