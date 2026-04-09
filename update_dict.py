import re

with open(r'c:\projects\AI-KYK\src\lib\i18n\dictionaries.ts', 'r', encoding='utf-8') as f:
    content = f.read()

translations = {
    'ko': {
        'coachEditorial': "1:1 전담 멘토",
        'coachTitle': "맞춤형 AI 코치",
        'myPageEditorial': "나만의 대시보드",
        'myPageTitle': "마이페이지"
    },
    'en': {
        'coachEditorial': "1:1 Dedicated Mentor",
        'coachTitle': "Personalized AI Coach",
        'myPageEditorial': "Personalized Dashboard",
        'myPageTitle': "My Page"
    },
    'ms': {
        'coachEditorial': "Mentor Khusus 1:1",
        'coachTitle': "Jurulatih AI Peribadi",
        'myPageEditorial': "Papan Pemuka Peribadi",
        'myPageTitle': "Halaman Saya"
    },
    'id': {
        'coachEditorial': "Mentor Khusus 1:1",
        'coachTitle': "Pelatih AI Pribadi",
        'myPageEditorial': "Dasbor Pribadi",
        'myPageTitle': "Halaman Saya"
    },
    'vi': {
        'coachEditorial': "Đồng hành 1:1",
        'coachTitle': "Huấn luyện viên AI Cá nhân",
        'myPageEditorial': "Bảng điều khiển Cá nhân",
        'myPageTitle': "Trang của Tôi"
    },
    'th': {
        'coachEditorial': "ผู้ดูแลส่วนตัว 1:1",
        'coachTitle': "โค้ช AI ส่วนตัว",
        'myPageEditorial': "หน้าหลักแบบส่วนตัว",
        'myPageTitle': "หน้าของฉัน"
    }
}

lines = content.split('\n')
new_lines = []
in_lang = None

for line in lines:
    new_lines.append(line)
    
    match = re.match(r'^\s*([a-z]{2}):\s*\{', line)
    if match:
        in_lang = match.group(1)
        if in_lang in translations:
            for k, v in translations[in_lang].items():
                if v.startswith('['):
                    new_lines.append(f"    {k}: {v},")
                else:
                    safe_v = v.replace('"', '\\"').replace('\n', '\\n')
                    new_lines.append(f'    {k}: "{safe_v}",')

with open(r'c:\projects\AI-KYK\src\lib\i18n\dictionaries.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))
print("Dictionaries updated.")
