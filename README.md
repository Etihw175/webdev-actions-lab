# webdev-actions-lab

แลปวิชา Web Development เรื่องการเผยแพร่เว็บ static ด้วย GitHub Actions และ GitHub Pages

- เว็บไซต์: https://etihw175.github.io/webdev-actions-lab/
- Repository: https://github.com/Etihw175/webdev-actions-lab
- ผู้จัดทำ: อภิภู ก้านสุวรรณ รหัสนิสิต 67160175

## ไฟล์ในโปรเจกต์

```
webdev-actions-lab/
├── index.html                  # 3 ส่วน: About Me / Skills / Contact
├── style.css                   # ตัวแปรสีกลาง สลับธีมได้ทั้งหน้า
├── script.js                   # ปุ่ม Say Hello + ปุ่มสลับธีม (จำค่าไว้ใน localStorage)
└── .github/workflows/deploy.yml  # workflow ที่ deploy ขึ้น GitHub Pages
```

## Exercise 4: workflow เริ่มเมื่อไร และ job `deploy` ทำอะไร

Workflow เริ่มทำงานเมื่อมีการ push ขึ้น branch `main` ตามที่เขียนไว้ใน `on.push.branches: [main]`
หรือเมื่อกดสั่งเองจากแท็บ Actions ผ่าน `workflow_dispatch`
ถ้า push ขึ้น branch อื่น เว็บจะไม่เปลี่ยน

`concurrency.group: pages` จำกัดให้มีงาน deploy ได้ครั้งละงานเดียว
ถ้า push ติดกันเร็ว ๆ งานเก่าจะถูกยกเลิกและใช้โค้ดล่าสุดแทน

job `deploy` รันบนเครื่อง Ubuntu ของ GitHub แล้วทำ 5 ขั้นตามลำดับนี้

| ขั้น | ทำอะไร |
|---|---|
| Checkout source code | ดึงโค้ดจาก repository ลงเครื่อง runner |
| Check required files | ตรวจว่ามี `index.html`, `style.css`, `script.js` ครบ ถ้าขาดไฟล์ใดจะหยุดตรงนี้ |
| Setup Pages | เตรียมค่าตั้งต้นของ GitHub Pages ให้ขั้นถัดไปใช้ |
| Upload static website | บีบไฟล์ทั้งโฟลเดอร์เป็น artifact ส่งให้ Pages |
| Deploy to GitHub Pages | นำ artifact ขึ้นเว็บจริง แล้วคืน URL ที่ `steps.deployment.outputs.page_url` |

`permissions` ที่ประกาศไว้ (`pages: write`, `id-token: write`) คือสิทธิ์ที่ action ใช้เขียนลง Pages
และยืนยันตัวตนกับ GitHub โดยที่เราไม่ต้องสร้าง token เอง

## คำตอบคำถามท้ายแลป

### 1) GitHub Actions ต่างจาก GitHub Pages อย่างไร

Actions เป็นระบบรันงานอัตโนมัติตามเหตุการณ์ที่เกิดใน repository เช่น push แล้วให้ทดสอบหรือ deploy
Pages เป็นบริการโฮสต์เว็บ static ที่ให้ URL สาธารณะ ในแลปนี้ Actions ทำหน้าที่ส่งไฟล์ไปวางบน Pages
ถ้าไม่มี Actions เราก็ยังเปิด Pages ได้ แต่ต้องอัปโหลดไฟล์เองทุกครั้ง

### 2) ทำไมจึง trigger ด้วย push ที่ branch `main`

`main` คือ branch ที่ถือว่าโค้ดพร้อมใช้งานจริง การผูก deploy ไว้กับ `main` ทำให้เว็บที่ออนไลน์
ตรงกับโค้ดล่าสุดที่ตรวจแล้วเสมอ ส่วนงานที่ยังทำไม่เสร็จอยู่บน branch อื่นได้โดยไม่กระทบเว็บ
และทุกการเปลี่ยนแปลงมี commit กำกับว่าใครแก้อะไรเมื่อไร ย้อนกลับได้ถ้าพลาด

### 3) ถ้าแก้ไฟล์ในเครื่องแต่ไม่ได้ push เว็บจะเปลี่ยนไหม

ไม่เปลี่ยน ไฟล์ที่แก้ยังอยู่แค่ในเครื่องเรา GitHub จึงไม่รู้ว่ามีอะไรเปลี่ยน
workflow ไม่ถูก trigger และ Pages ยังเสิร์ฟไฟล์ชุดเดิมอยู่
ต้อง `git add` แล้ว `git commit` แล้ว `git push` ให้โค้ดขึ้นไปอยู่บน `main` ก่อน Actions จึงจะเริ่มทำงาน

### 4) ทำไมโปรเจกต์ PHP กับ MySQL รันบน GitHub Pages ตรง ๆ ไม่ได้

Pages เสิร์ฟได้เฉพาะไฟล์ static คือส่งไฟล์ตามที่เก็บไว้ ไม่มีตัวแปลภาษาฝั่งเซิร์ฟเวอร์
ไฟล์ `.php` จึงไม่ถูกประมวลผล และไม่มีฐานข้อมูลให้ MySQL ทำงาน
ถ้าเปิดไฟล์ PHP ผู้เข้าชมจะเห็นโค้ดดิบแทนผลลัพธ์
ถ้าต้องใช้ PHP กับ MySQL ให้แยกเป็นสองส่วน: หน้าเว็บ static วางบน Pages
แล้วเรียก API ที่โฮสต์บนบริการซึ่งรันโค้ดฝั่งเซิร์ฟเวอร์ได้ เช่น Render, Railway หรือโฮสต์ที่รองรับ PHP

### 5) ขั้นตอนหาสาเหตุเมื่อ workflow ขึ้นสถานะ Failed

1. เปิดแท็บ Actions เลือก run ที่ล้ม ดูว่าหยุดที่ step ไหน step ที่ล้มจะมีกากบาทแดง
2. กางบรรทัด log ของ step นั้น อ่านบรรทัดสุดท้ายก่อน error ส่วนใหญ่บอกสาเหตุตรง ๆ เช่น หาไฟล์ไม่เจอ
   YAML เยื้องผิด หรือสิทธิ์ไม่พอ
3. เทียบกับจุดที่พลาดบ่อย: ชื่อและตำแหน่งไฟล์ `.github/workflows/deploy.yml`, `permissions` ใน YAML
   และ Settings → Pages ต้องตั้ง Source เป็น GitHub Actions
4. แก้ในเครื่องแล้ว commit และ push ใหม่ หรือกด Re-run jobs ถ้าคิดว่าเป็นปัญหาชั่วคราวของ runner
5. ดูให้ run ใหม่ขึ้นสีเขียว แล้วเปิดเว็บด้วย hard refresh เพื่อยืนยันว่าแก้ได้จริง

## วิธีรันในเครื่อง

เปิด `index.html` ด้วยเบราว์เซอร์ได้เลย ไม่ต้องติดตั้งอะไรเพิ่ม
