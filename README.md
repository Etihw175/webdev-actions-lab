# webdev-actions-lab

แลปวิชา Web Development — เผยแพร่เว็บ static ด้วย **GitHub Actions + GitHub Pages**

- **เว็บไซต์:** https://etihw175.github.io/webdev-actions-lab/
- **Repository:** https://github.com/Etihw175/webdev-actions-lab
- ผู้จัดทำ: อภิภู ก้านสุวรรณ รหัสนิสิต 67160175

## ไฟล์ในโปรเจกต์

```
webdev-actions-lab/
├── index.html                  # 3 ส่วน: About Me / Skills / Contact
├── style.css                   # ตัวแปรสีกลาง สลับธีมได้ทั้งหน้า
├── script.js                   # ปุ่ม Say Hello + ปุ่มสลับธีม (จำค่าไว้ใน localStorage)
└── .github/workflows/deploy.yml  # workflow ที่ deploy ขึ้น GitHub Pages
```

## Exercise 4 — workflow นี้ทำงานเมื่อไร และ job `deploy` ทำอะไร

**เริ่มทำงานเมื่อ** มีการ push ขึ้น branch `main` (`on.push.branches: [main]`)
หรือกดสั่งเองจากแท็บ Actions (`workflow_dispatch`)
push ขึ้น branch อื่นจะไม่ทำให้เว็บเปลี่ยน

`concurrency.group: pages` บังคับว่าคิว deploy มีได้ครั้งละงานเดียว
ถ้า push ซ้อนกันเร็ว ๆ งานเก่าจะถูกยกเลิกและใช้โค้ดล่าสุดแทน

**job `deploy`** รันบนเครื่อง Ubuntu ของ GitHub แล้วทำ 5 ขั้นตามลำดับ

| ขั้น | ทำอะไร |
|---|---|
| Checkout source code | ดึงโค้ดจาก repository ลงเครื่อง runner |
| Check required files | ตรวจว่ามี `index.html`, `style.css`, `script.js` ครบ — ขาดไฟล์ใดให้ล้มตรงนี้ ไม่ต้อง deploy |
| Setup Pages | เตรียมค่าการตั้งค่าของ GitHub Pages ให้ขั้นถัดไปใช้ |
| Upload static website | บีบไฟล์ทั้งโฟลเดอร์เป็น artifact ส่งให้ Pages |
| Deploy to GitHub Pages | นำ artifact ขึ้นเว็บจริง แล้วคืน URL ออกมาที่ `steps.deployment.outputs.page_url` |

`permissions` ที่ประกาศไว้ (`pages: write`, `id-token: write`) คือสิทธิ์ที่ action ต้องใช้
เพื่อเขียนลง Pages และยืนยันตัวตนกับ GitHub โดยไม่ต้องสร้าง token เอง

## คำตอบคำถามท้ายแลป

**1) GitHub Actions ต่างจาก GitHub Pages อย่างไร**
Actions คือระบบรันงานอัตโนมัติ (CI/CD) ที่ทำงานตามเหตุการณ์ เช่น push แล้วสั่งทดสอบหรือ deploy
ส่วน Pages คือบริการโฮสต์เว็บ static ที่ให้ URL สาธารณะ
Actions คือ "คนทำงาน" ส่วน Pages คือ "ที่วางเว็บ" — ในแลปนี้ Actions เป็นฝ่ายส่งไฟล์ไปวางบน Pages

**2) ทำไมจึง trigger ด้วย push ที่ branch `main`**
`main` คือ branch ที่ถือว่าโค้ดพร้อมใช้งานจริง การผูก deploy ไว้กับ `main` ทำให้เว็บที่ออนไลน์
ตรงกับโค้ดล่าสุดที่ผ่านการตรวจแล้วเสมอ ส่วนงานที่ยังทำไม่เสร็จอยู่บน branch อื่นได้โดยไม่กระทบเว็บจริง
และทุกการเปลี่ยนแปลงจะมี commit กำกับว่าใครแก้อะไร ย้อนกลับได้

**3) ถ้าแก้ไฟล์ในเครื่องแต่ไม่ได้ push เว็บจะเปลี่ยนไหม**
ไม่เปลี่ยน การแก้ในเครื่องอยู่แค่ในเครื่องเรา GitHub ยังไม่เห็นการเปลี่ยนแปลงนั้น
workflow จึงไม่ถูก trigger และ Pages ยังเสิร์ฟไฟล์ชุดเดิมอยู่ ต้อง `git add` → `git commit` → `git push`
ให้โค้ดขึ้นไปอยู่บน `main` ก่อน Actions ถึงจะเริ่มทำงาน

**4) ทำไมโปรเจกต์ PHP + MySQL รันบน GitHub Pages ตรง ๆ ไม่ได้**
Pages เสิร์ฟได้เฉพาะไฟล์ static — ส่งไฟล์ตามที่เก็บไว้ ไม่มีตัวแปลภาษาฝั่งเซิร์ฟเวอร์
ไฟล์ `.php` จึงไม่ถูกประมวลผล และไม่มีฐานข้อมูลให้ MySQL ทำงาน ถ้าเปิดไฟล์ PHP ผู้ใช้จะเห็นโค้ดดิบ
ถ้าต้องใช้ PHP/MySQL ต้องแยกเป็นสองส่วน: หน้าเว็บ static ไว้บน Pages แล้วเรียก API
ที่โฮสต์บนบริการที่รันฝั่งเซิร์ฟเวอร์ได้ (เช่น Render, Railway หรือโฮสต์ที่รองรับ PHP)

**5) ขั้นตอนหาสาเหตุเมื่อ workflow ขึ้นสถานะ Failed**
1. เปิดแท็บ **Actions** เลือก run ที่ล้ม ดูว่าหยุดที่ step ไหน (step ที่ล้มจะมีกากบาทแดง)
2. กางบรรทัด log ของ step นั้น อ่านบรรทัดสุดท้ายก่อน error — ส่วนใหญ่บอกสาเหตุตรง ๆ
   เช่น ไฟล์ไม่พบ, YAML เยื้องผิด, หรือสิทธิ์ไม่พอ
3. เทียบกับ 3 จุดที่พลาดบ่อย: ชื่อ/ตำแหน่งไฟล์ `.github/workflows/deploy.yml`,
   `permissions` ใน YAML และ Settings → Pages ต้องตั้ง Source เป็น **GitHub Actions**
4. แก้ในเครื่อง แล้ว commit + push ใหม่ หรือกด **Re-run jobs** ถ้าเชื่อว่าเป็นปัญหาชั่วคราว
5. ยืนยันว่าแก้ได้จริงโดยดูให้ run ใหม่เป็นสีเขียว แล้วเปิดเว็บ (hard refresh) ดูผล

## วิธีรันในเครื่อง

เปิด `index.html` ด้วยเบราว์เซอร์ได้เลย ไม่ต้องติดตั้งอะไรเพิ่ม
