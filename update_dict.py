import re
import os

with open(r'c:\projects\AI-KYK\src\lib\i18n\dictionaries.ts', 'r', encoding='utf-8') as f:
    content = f.read()

translations = {
    'ko': {
        'step2Title': "우리 아이의 평소 모습에\\n가장 가까운 것을 선택해주세요",
        'step2Complete': "응답 완료",
        'step2Next': "다음으로",
        'step2Options': "['전혀 아님', '아님', '그렇다', '매우 그렇다']",
        'step2Questions': "['우리 아이는 새로운 친구를 사귀는 것이 어렵지 않다.', '우리 아이는 혼자서도 조용히 잘 논다.', '처음 보는 사람 앞에서도 자연스럽게 말한다.', '우리 아이는 이야기를 들을 때 그 배경이나 이유를 궁금해한다.', '우리 아이는 그림을 사실적으로 그리는 걸 좋아한다.', '놀이 중 상상 속 세계나 규칙을 만들어내는 편이다.', '친구가 울면 함께 공감하려고 한다.', '우리 아이는 상황을 논리적으로 설명하려 한다.', '어떤 것이 옳고 그른지를 중요하게 생각한다.', '우리 아이는 해야 할 일을 미리 계획해서 처리하는 편이다.', '일정이 바뀌면 당황하거나 싫어한다.', '하고 싶은 것을 먼저 하고, 싫은 건 나중에 미루는 편이다.']",
        'step3Title': "아이에 대해\\n조금 더 알려주세요",
        'step3Subtitle': "더 정확한 분석을 위해 필요해요.",
        'step3BirthYear': "아이 출생년도",
        'step3YearSuffix': "년",
        'step3Gender': "성별",
        'step3Boy': "남아",
        'step3Girl': "여아",
        'step3Region': "현재 사는 지역",
        'step3RegionList': "['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']",
        'step3ConcernTitle': "요즘 가장 걱정되는 부분",
        'step3ConcernMax': "최대 3개",
        'step3ConcernList': "['말이 늦거나 표현이 부족해요', '감정 조절이 어렵고 떼를 써요', '밥을 잘 안 먹거나 편식이 심해요', '낯가림이 심하거나 새 환경에 적응을 못해요', '또래 친구와 잘 어울리지 못해요', '집중력이 짧고 산만한 편이에요', '잠들기가 어렵거나 수면 문제가 있어요', '형제자매 혹은 다른 아이와 자주 싸워요', '새로운 것에 도전하길 두려워해요', '한글·숫자 등 학습에 흥미가 없어요']",
        'step3CustomTitle': "여기에 있는 예시와는 다른 고민이 있어요",
        'step3CustomPlaceholder': "어떤 고민이 있으신가요?",
        'step3NoConcern': "특별한 고민은 없어요",
        'step3Submit': "결과 확인하기"
    },
    'en': {
        'step2Title': "Choose the option that best\\ndescribes your child's usual behavior",
        'step2Complete': "Completed",
        'step2Next': "Next",
        'step2Options': "['Not at all', 'No', 'Yes', 'Very much']",
        'step2Questions': "['My child easily makes new friends.', 'My child plays quietly by themselves.', 'My child speaks naturally even in front of strangers.', 'My child is curious about the background or reason when listening to stories.', 'My child likes to draw things realistically.', 'My child tends to invent imaginary worlds or rules during play.', 'My child tries to empathize when a friend cries.', 'My child tries to explain situations logically.', 'My child considers what is right and wrong to be important.', 'My child tends to plan and handle tasks in advance.', 'My child gets flustered or dislikes it when schedules change.', 'My child tends to do what they want first and puts off what they dislike.']",
        'step3Title': "Please tell us a little bit\\nmore about your child",
        'step3Subtitle': "We need this for a more accurate analysis.",
        'step3BirthYear': "Child's Birth Year",
        'step3YearSuffix': "",
        'step3Gender': "Gender",
        'step3Boy': "Boy",
        'step3Girl': "Girl",
        'step3Region': "Current Region of Residence",
        'step3RegionList': "['Seoul', 'Gyeonggi', 'Incheon', 'Busan', 'Daegu', 'Gwangju', 'Daejeon', 'Ulsan', 'Sejong', 'Gangwon', 'Chungbuk', 'Chungnam', 'Jeonbuk', 'Jeonnam', 'Gyeongbuk', 'Gyeongnam', 'Jeju']",
        'step3ConcernTitle': "Most concerning issues lately",
        'step3ConcernMax': "Max 3",
        'step3ConcernList': "['Delayed speech or lack of expression', 'Difficulty controlling emotions and throws tantrums', 'Poor eater or severe picky eating', 'Severe shyness or inability to adapt to new environments', 'Unable to get along well with peers', 'Short attention span and tends to be distracted', 'Difficulty falling asleep or has sleep issues', 'Frequently fights with siblings or other children', 'Afraid to try new things', 'Lack of interest in learning letters, numbers, etc.']",
        'step3CustomTitle': "I have a different concern not listed here",
        'step3CustomPlaceholder': "What is your concern?",
        'step3NoConcern': "No special concerns",
        'step3Submit': "Check Results"
    },
    'ms': {
        'step2Title': "Pilih pilihan yang paling tepat\\nmenggambarkan tingkah laku biasa anak anda",
        'step2Complete': "Selesai",
        'step2Next': "Seterusnya",
        'step2Options': "['Sama sekali tidak', 'Tidak', 'Ya', 'Sangat ya']",
        'step2Questions': "['Anak saya mudah mendapat kawan baru.', 'Anak saya bermain sendirian dengan tenang.', 'Anak saya bercakap secara semula jadi walaupun di hadapan orang yang tidak dikenali.', 'Anak saya ingin tahu tentang latar belakang atau sebab apabila mendengar cerita.', 'Anak saya suka melukis sesuatu secara realistik.', 'Anak saya cenderung untuk mencipta dunia imaginasi atau peraturan semasa bermain.', 'Anak saya cuba untuk bersimpati apabila rakan menangis.', 'Anak saya cuba menerangkan situasi secara logik.', 'Anak saya menganggap apa yang betul dan salah sebagai penting.', 'Anak saya cenderung merancang dan mengendalikan tugas lebih awal.', 'Anak saya menjadi gelisah atau tidak menyukainya apabila jadual berubah.', 'Anak saya cenderung untuk melakukan apa yang mereka mahu dahulu dan menangguhkan apa yang mereka tidak suka.']",
        'step3Title': "Sila beritahu kami sedikit\\nlagi tentang anak anda",
        'step3Subtitle': "Kami perlukan ini untuk analisis yang lebih tepat.",
        'step3BirthYear': "Tahun Kelahiran Anak",
        'step3YearSuffix': "",
        'step3Gender': "Jantina",
        'step3Boy': "Lelaki",
        'step3Girl': "Perempuan",
        'step3Region': "Kawasan Kediaman Semasa",
        'step3RegionList': "['Seoul', 'Gyeonggi', 'Incheon', 'Busan', 'Daegu', 'Gwangju', 'Daejeon', 'Ulsan', 'Sejong', 'Gangwon', 'Chungbuk', 'Chungnam', 'Jeonbuk', 'Jeonnam', 'Gyeongbuk', 'Gyeongnam', 'Jeju']",
        'step3ConcernTitle': "Isu yang paling membimbangkan kebelakangan ini",
        'step3ConcernMax': "Maksimum 3",
        'step3ConcernList': "['Lambat bercakap atau kurang ekspresi', 'Sukar mengawal emosi dan mengamuk', 'Kurang makan atau sangat cerewet memilih makanan', 'Terlalu pemalu atau tidak dapat menyesuaikan diri dengan persekitaran baharu', 'Tidak dapat bergaul dengan rakan sebaya', 'Jangka tumpuan pendek dan mudah terganggu', 'Sukar tidur atau mempunyai masalah tidur', 'Kerap bergaduh dengan adik-beradik atau kanak-kanak lain', 'Takut mencuba perkara baharu', 'Kurang minat untuk mempelajari huruf, nombor, dsbg.']",
        'step3CustomTitle': "Saya mempunyai kebimbangan lain yang tidak disenaraikan di sini",
        'step3CustomPlaceholder': "Apakah kebimbangan anda?",
        'step3NoConcern': "Tiada kebimbangan khusus",
        'step3Submit': "Semak Keputusan"
    },
    'id': {
        'step2Title': "Pilih opsi yang paling\\nmenggambarkan perilaku biasa anak Anda",
        'step2Complete': "Selesai",
        'step2Next': "Berikutnya",
        'step2Options': "['Sangat tidak', 'Tidak', 'Ya', 'Sangat ya']",
        'step2Questions': "['Anak saya mudah mendapat teman baru.', 'Anak saya bermain dengan tenang sendirian.', 'Anak saya berbicara secara alami bahkan di depan orang asing.', 'Anak saya ingin tahu tentang latar belakang atau alasan saat mendengarkan cerita.', 'Anak saya suka menggambar secara realistis.', 'Anak saya cenderung menciptakan dunia atau aturan imajiner saat bermain.', 'Anak saya mencoba berempati ketika seorang teman menangis.', 'Anak saya mencoba menjelaskan situasi secara logis.', 'Anak saya menganggap apa yang benar dan salah itu penting.', 'Anak saya cenderung merencanakan dan menangani tugas sebelumnya.', 'Anak saya menjadi bingung atau tidak menyukainya ketika jadwal berubah.', 'Anak saya cenderung melakukan apa yang mereka inginkan lebih dulu dan menunda apa yang tidak mereka sukai.']",
        'step3Title': "Tolong beri tahu kami sedikit\\nlebih banyak tentang anak Anda",
        'step3Subtitle': "Kami membutuhkan ini untuk analisis yang lebih akurat.",
        'step3BirthYear': "Tahun Kelahiran Anak",
        'step3YearSuffix': "",
        'step3Gender': "Jenis Kelamin",
        'step3Boy': "Laki-laki",
        'step3Girl': "Perempuan",
        'step3Region': "Wilayah Tempat Tinggal Saat Ini",
        'step3RegionList': "['Seoul', 'Gyeonggi', 'Incheon', 'Busan', 'Daegu', 'Gwangju', 'Daejeon', 'Ulsan', 'Sejong', 'Gangwon', 'Chungbuk', 'Chungnam', 'Jeonbuk', 'Jeonnam', 'Gyeongbuk', 'Gyeongnam', 'Jeju']",
        'step3ConcernTitle': "Masalah yang paling memprihatinkan akhir-akhir ini",
        'step3ConcernMax': "Maksimal 3",
        'step3ConcernList': "['Keterlambatan bicara atau kurang ekspresi', 'Kesulitan mengendalikan emosi dan mengamuk', 'Nafsu makan buruk atau sangat pilih-pilih makanan', 'Sangat pemalu atau tidak dapat beradaptasi dengan lingkungan baru', 'Tidak dapat bergaul dengan teman sebaya', 'Rentang perhatian pendek dan cenderung teralihkan', 'Kesulitan tidur atau memiliki masalah beralih', 'Sering bertengkar dengan saudara kandung atau anak-anak lain', 'Takut mencoba hal baru', 'Kurangnya minat untuk belajar huruf, angka, dll.']",
        'step3CustomTitle': "Saya memiliki kekhawatiran yang berbeda yang tidak tercantum di sini",
        'step3CustomPlaceholder': "Apa kekhawatiran Anda?",
        'step3NoConcern': "Tidak ada kekhawatiran khusus",
        'step3Submit': "Cek Hasil"
    },
    'vi': {
        'step2Title': "Chọn tùy chọn mô tả đúng nhất\\nhành vi thông thường của con bạn",
        'step2Complete': "Hoàn thành",
        'step2Next': "Tiếp theo",
        'step2Options': "['Hoàn toàn không', 'Không', 'Có', 'Rất đúng']",
        'step2Questions': "['Con tôi dễ dàng kết bạn mới.', 'Con tôi chơi một mình yên lặng.', 'Con tôi nói chuyện tự nhiên ngay cả trước mặt người lạ.', 'Con tôi tò mò về bối cảnh hoặc lý do khi nghe các câu chuyện.', 'Con tôi thích vẽ đồ vật một cách chân thực.', 'Con tôi có xu hướng tạo ra thế giới hoặc quy tắc tưởng tượng khi chơi.', 'Con tôi cố gắng đồng cảm khi thấy bạn bè khóc.', 'Con tôi cố gắng giải thích tình huống một cách hợp lý.', 'Con tôi coi trọng điều gì là đúng và sai.', 'Con tôi có xu hướng lập kế hoạch và xử lý công việc từ trước.', 'Con tôi tỏ ra bối rối hoặc không thích khi lịch trình thay đổi.', 'Con tôi có xu hướng làm những gì chúng muốn trước và trì hoãn những gì chúng không thích.']",
        'step3Title': "Vui lòng cho chúng tôi biết một chút\\nthêm về con của bạn",
        'step3Subtitle': "Chúng tôi cần điều này để phân tích chính xác hơn.",
        'step3BirthYear': "Năm Sinh Của Bé",
        'step3YearSuffix': "",
        'step3Gender': "Giới tính",
        'step3Boy': "Bé trai",
        'step3Girl': "Bé gái",
        'step3Region': "Khu Vực Cư Trú Hiện Tại",
        'step3RegionList': "['Seoul', 'Gyeonggi', 'Incheon', 'Busan', 'Daegu', 'Gwangju', 'Daejeon', 'Ulsan', 'Sejong', 'Gangwon', 'Chungbuk', 'Chungnam', 'Jeonbuk', 'Jeonnam', 'Gyeongbuk', 'Gyeongnam', 'Jeju']",
        'step3ConcernTitle': "Những vấn đề đáng lo ngại nhất gần đây",
        'step3ConcernMax': "Tối đa 3",
        'step3ConcernList': "['Chậm nói hoặc thiếu biểu cảm', 'Khó kiểm soát cảm xúc và hay ăn vạ', 'Kén ăn hoặc rất lười ăn', 'Rất nhút nhát hoặc không thể thích nghi với môi trường mới', 'Không thể hòa đồng với bạn bè cùng trang lứa', 'Khoảng thời gian chú ý ngắn và dễ bị phân tâm', 'Khó ngủ hoặc có vấn đề về giấc ngủ', 'Thường xuyên đánh nhau với anh/chị/em hoặc những đứa trẻ khác', 'Sợ thử nghiệm những điều mới', 'Thiếu hứng thú với việc học chữ cái, con số, v.v.']",
        'step3CustomTitle': "Tôi có một số mối lo ngại khác không được liệt kê ở đây",
        'step3CustomPlaceholder': "Mối lo ngại của bạn là gì?",
        'step3NoConcern': "Không có mối lo ngại đặc biệt",
        'step3Submit': "Kiểm tra Kết quả"
    },
    'th': {
        'step2Title': "เลือกตัวเลือกที่ตรงกับ\\nพฤติกรรมปกติของลูกคุณมากที่สุด",
        'step2Complete': "เสร็จสิ้น",
        'step2Next': "ถัดไป",
        'step2Options': "['ไม่เลย', 'ไม่', 'ใช่', 'มากๆ']",
        'step2Questions': "['ลูกของฉันหาเพื่อนใหม่ได้ง่าย', 'ลูกของฉันเล่นเงียบๆ คนเดียวได้', 'ลูกของฉันพูดคุยอย่างเป็นธรรมชาติแม้ต่อหน้าคนแปลกหน้า', 'ลูกของฉันรู้สึกอยากรู้อยากเห็นเกี่ยวกับภูมิหลังหรือเหตุผลเมื่อฟังเรื่องราว', 'ลูกของฉันชอบวาดภาพสิ่งต่างๆ อย่างสมจริง', 'ลูกของฉันมักจะสร้างโลกแห่งจินตนาการหรือกฎเกณฑ์ระหว่างการเล่น', 'ลูกของฉันพยายามเห็นอกเห็นใจเมื่อเพื่อนร้องไห้', 'ลูกของฉันพยายามอธิบายสถานการณ์อย่างมีเหตุผล', 'ลูกของฉันให้ความสำคัญกับสิ่งที่ถูกและผิด', 'ลูกของฉันมักจะวางแผนและจัดการงานล่วงหน้า', 'ลูกของฉันสับสนหรือไม่ชอบเมื่อตารางเวลาเปลี่ยนไป', 'ลูกของฉันมักจะทำสิ่งที่อยากทำก่อนแล้วค่อยผลัดสิ่งที่ไม่อยากทำไปก่อน']",
        'step3Title': "โปรดเล่าให้เราฟังอีกนิด\\nเกี่ยวกับลูกของคุณ",
        'step3Subtitle': "เราจำเป็นต้องใช้ข้อมูลนี้เพื่อการวิเคราะห์ที่แม่นยำยิ่งขึ้น",
        'step3BirthYear': "ปีเกิดของลูก",
        'step3YearSuffix': "",
        'step3Gender': "เพศ",
        'step3Boy': "เด็กชาย",
        'step3Girl': "เด็กหญิง",
        'step3Region': "ภูมิภาคที่พำนักอาศัยในปัจจุบัน",
        'step3RegionList': "['Seoul', 'Gyeonggi', 'Incheon', 'Busan', 'Daegu', 'Gwangju', 'Daejeon', 'Ulsan', 'Sejong', 'Gangwon', 'Chungbuk', 'Chungnam', 'Jeonbuk', 'Jeonnam', 'Gyeongbuk', 'Gyeongnam', 'Jeju']",
        'step3ConcernTitle': "ปัญหาที่น่ากังวลที่สุดในช่วงนี้",
        'step3ConcernMax': "สูงสุด 3 ข้อ",
        'step3ConcernList': "['พูดช้าหรือขาดการแสดงออก', 'ควบคุมอารมณ์ยากและร้องอาละวาด', 'กินยากหรือเลือกกินมาก', 'ขี้อายมากหรือไม่สามารถปรับตัวเข้ากับสภาพแวดล้อมใหม่ได้', 'เข้ากับเพื่อนวัยเดียวกันไม่ได้', 'สมาธิสั้นและถูกรบกวนได้ง่าย', 'หลับยากหรือมีปัญหาเรื่องการนอน', 'ทะเลาะกับพี่น้องหรือเด็กคนอื่นๆ บ่อยๆ', 'กลัวการลองทำสิ่งใหม่ๆ', 'ขาดความสนใจในการเรียนรู้ตัวอักษร ตัวเลข ฯลฯ']",
        'step3CustomTitle': "ฉันมีความกังวลอื่นที่ไม่ได้ระบุไว้ที่นี่",
        'step3CustomPlaceholder': "ความกังวลของคุณคืออะไร?",
        'step3NoConcern': "ไม่มีความกังวลเป็นพิเศษ",
        'step3Submit': "ตรวจสอบผลลัพธ์"
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
        # Inject right after language object starts
        if in_lang in translations:
            for k, v in translations[in_lang].items():
                if v.startswith('['):
                    new_lines.append(f"    {k}: {v},")
                else:
                    safe_v = v.replace('"', '\\"')
                    new_lines.append(f'    {k}: "{safe_v}",')

with open(r'c:\projects\AI-KYK\src\lib\i18n\dictionaries.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))
