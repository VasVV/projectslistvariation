const nodemailer = require("nodemailer");
const express = require('express');
const app = express();
const multiparty = require('multiparty');
const path = require('path');

const cors = require('cors');

app.use(cors({origin: true}));

app.use(
    express.urlencoded({
      extended: true
    })
  )
  
  app.use(express.json());


  
app.post('/sendContactForm', async (req, res) => {
  let form = new multiparty.Form();
  let name, idea, type, contact, file, headEmails;
  form.parse(req, async function (err, fields, files) {
    if (err) {
      console.log(err);
    } else {
      let data = fields.data[0].split(',');
      name = data[0];
      idea = data[1];
      type = data[2];
      contact = data[3];
      headEmails = data.splice(4).join(', ');
      console.log('headEmails');
      console.log(headEmails)
      if (files.file){
        file = files.file[0]
      }
      let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: "radioheadboy0@gmail.com", 
        pass: "brbaricvegcwyarf", 
      },
    });
    if (file) {
      let info = await transporter.sendMail({
      from: '" 👻" <noreply@example.com>', 
      to: headEmails,
      subject: `Кто-то хочет ${type}`, 
      text: `Новое сообщение от ${name}. ${idea} C этим человеком можно связаться: ${contact}`, 
      attachments: [
       {  
         filename: file.originalFilename,
         content: file
       }
      ]
    })
    console.log("Message sent: %s", info.messageId);
    } else {
      let info = await transporter.sendMail({
        from: '" 👻" <noreply@example.com>', 
        to: headEmails,
        subject: `Кто-то хочет ${type}`, 
        text: `Новое сообщение от ${name}. ${idea} C этим человеком можно связаться: ${contact}`, 
      })
      console.log("Message sent: %s", info.messageId);
    }

    
    res.send('message sent!')
    }
  })
  
  

  

})  

app.post('/sendmail', async (req, res) => {

const information = req.body;
console.log(information);
  
 


  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: "radioheadboy0@gmail.com", 
      pass: "brbaricvegcwyarf", 
    },
  });

 
  let info = await transporter.sendMail({
    from: '" 👻" <noreply@example.com>', 
    to: information.currProjectHeadEmail, 
    subject: "Новый програмист присоединился к вашему проекту", 
    text: `К вашему проекту ${information.currProjectName} присоединился новый программист ${information.programmerProperties.programmerName}. Он обладает следующими навыками: ${information.programmerProperties.programmerSkills} и хочет работать над ${information.programmerProperties.programmerWishes}. C ним можно связаться ${information.programmerProperties.programmerContact}`, 
  });

  console.log("Message sent: %s", info.messageId);
  res.send('message sent!')
  
})
app.use(express.static(path.join(__dirname, '../build')));

app.listen(process.env.PORT || 4242, () => console.log(`Node server listening on port ${process.env.PORT}!`));