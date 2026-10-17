# หลักฐานการส่งงาน: LAB GitHub Actions + GitHub Pages

ผู้จัดทำ: อภิภู ก้านสุวรรณ รหัสนิสิต 67160175

| รายการที่ต้องส่ง | ข้อมูล |
|---|---|
| (ก) GitHub Repository URL | https://github.com/Etihw175/webdev-actions-lab |
| (ข) GitHub Pages URL | https://etihw175.github.io/webdev-actions-lab/ |
| (ค) Screenshot แท็บ Actions ที่ deploy สำเร็จ | [`evidence/02-actions.png`](evidence/02-actions.png) |
| (ง) Screenshot หน้าเว็บไซต์ที่แก้ไขแล้ว | [`evidence/01-website.png`](evidence/01-website.png) |
| (จ) คำตอบคำถามท้ายแลป | [`README.md`](README.md#คำตอบคำถามท้ายแลป) |

## สิ่งที่ทำตามโจทย์

| Part / Exercise | ทำอะไร | ดูได้ที่ |
|---|---|---|
| Part A | สร้าง repository `webdev-actions-lab` แบบ public พร้อมไฟล์ `index.html`, `style.css`, `script.js` แล้ว commit และ push | commit `dcdb214` |
| Part B | เขียน workflow สำหรับ deploy | [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) |
| Part C | ตั้ง Settings → Pages → Source เป็น GitHub Actions แล้ว deploy ผ่าน | run #1 ขึ้นสีเขียว |
| Part D | แก้ `<h1>` และสีปุ่มใน `style.css` แล้ว push ซ้ำ Actions รันใหม่เองและเว็บอัปเดตตาม | commit `d171c3d`, run #2 |
| Exercise 1 | ใส่ชื่อ รหัสนิสิต และข้อความต้อนรับของตนเอง | `index.html` ส่วน hero |
| Exercise 2 | หน้าเว็บมี 3 ส่วน คือ About Me, Skills และ Contact | `index.html` |
| Exercise 3 | ปุ่ม Say Hello เปลี่ยนข้อความพร้อมเวลา และปุ่มสลับธีมที่จำค่าไว้ | `script.js` |
| Exercise 4 | อธิบายว่า workflow เริ่มเมื่อใด และ job `deploy` ทำอะไร | [`README.md`](README.md) |
| Challenge | เพิ่ม step `test -f` ตรวจไฟล์ก่อน deploy | step `Check required files` |

## บันทึกการรัน

| Run | Commit | สถานะ | เวลา |
|---|---|---|---|
| #1 Create starter website | `dcdb214` | สำเร็จ | 17 วินาที |
| #2 Update home page design | `d171c3d` | สำเร็จ | 20 วินาที |

หลัง deploy รอบที่สอง เว็บตอบ HTTP 200 หัวข้อเปลี่ยนเป็น "Deployed by GitHub Actions"
และไฟล์ `style.css` บนเซิร์ฟเวอร์เป็นสีใหม่ `#0f7a5a` ตามที่แก้ไว้

## หมายเหตุเรื่องเวอร์ชันของ action

เอกสารแลประบุ `actions/checkout@v6` และ `actions/upload-pages-artifact@v4`
แต่เวอร์ชันที่ใช้งานได้จริงคือ `actions/checkout@v4` และ `actions/upload-pages-artifact@v3`
จึงใช้สองตัวนี้แทน ส่วน `configure-pages@v5` และ `deploy-pages@v4` ตรงกับเอกสาร
