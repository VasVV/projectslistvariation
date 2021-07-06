import react from 'react';
import {useState, useEffect} from 'react';
import {db} from './firebase';
import axios from 'axios';
import {Button, Modal, TextField, Card,  CardContent, Select, InputLabel, MenuItem} from '@material-ui/core/';
import Alert from '@material-ui/lab/Alert';

export default function ContactForm() {

    const [formSent, setFormSent] = useState(false);
    const [formErr, setFormErr] = useState(false);

    const [contactFormData, setContactFormData] = useState({
        yourName: '',
        yourIdea: '',
        yourContact: '',
        yourRequestType: '',
        yourFile: ''
    });

    const handleFile = e => {
        setContactFormData(prevState => ({
            ...prevState,
            yourFile: e
        }))
    }
    const handleChangeContactForm = e => {
        setContactFormData(prevState => ({
          ...prevState,
          [e.target.name]: e.target.value
        }
        ))
      }

      const contactFormSubmit = async e => {
        e.preventDefault();
        const projectsRef = await db.collection('projects').get();
        let headEmails = [];
        projectsRef.forEach(doc => headEmails.push(doc.data()));
        headEmails = headEmails.map(e => e.projectHeadEmail).join(', ');
       

        const formData = new FormData();
        formData.append("file", contactFormData.yourFile);
        formData.append("data", [contactFormData.yourName, contactFormData.yourIdea, contactFormData.yourRequestType, contactFormData.yourContact, [headEmails]]);
        

    

    axios({
        method: "post",
        url: `${window.location.origin}/sendContactForm`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(res => {
        if (res.status == 200) {
          setFormSent(true);
        }
      }).catch(err => { 
        setFormErr(true);
      })

       
    }
    return (
        <div className="app__contactform">
          <form className="app__contactform__form" onSubmit={ (e) => contactFormSubmit(e)}>
          <p>Если у Вас есть предложения или пожелания касательно работы сообщества или Вы желаете присоединиться в качестве начинающего ИТ специалиста, заполните форму ниже.</p>

        <p>Если уже имеете идею проекта, над которым хотелось бы работать в команде, вкратце опишите ее в текстовом поле. При необходимости можете прикрепить документ.</p>

        <p>Будем искренне благодарны за обратную связь!</p>
            <div className='app__contactform__form__inner__wrapper'>
              {formSent && <Alert severity="success">Сообщение отправлено!</Alert>}
              {formErr && <Alert severity="error">Сообщение не отправлено!</Alert>}
            <InputLabel id="demo-simple-select-label">Тип обращения</InputLabel>
            <Select
          name='yourRequestType'
          onChange={(e) => handleChangeContactForm(e)}
        >
          <MenuItem value={'Предложить идею проекта'}>Предложить идею проекта</MenuItem>
          <MenuItem value={'Присоединиться к существующему проекту'}>Присоединиться к существующему проекту</MenuItem>
        </Select>
                <TextField required label="Ваше имя" name='yourName' className='app__contactform__form__inner__wrapper__field' onChange={(e) => handleChangeContactForm(e)} />
                <TextField required label="Предложения, пожелания, идея проекта" name='yourIdea' className='app__contactform__form__inner__wrapper__field' onChange={(e) => handleChangeContactForm(e)} />
                <TextField required label="Как с вами связаться?" name='yourContact' className='app__contactform__form__inner__wrapper__field' onChange={(e) => handleChangeContactForm(e)} />

                <Button
                    variant="contained"
                    component="label"
                    >
                    Загрузить файл
                    <input
                        type="file"
                        hidden
                        name='yourFile'
                        onChange={(e) => handleFile(e.target.files[0])} 
                    />
                </Button>
                <Button
                    type="submit"
                    >
                        Отправить форму
                    </Button>
            </div>
          </form>
      </div>
    )
}