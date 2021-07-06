import react from 'react';

import {useLocation} from 'react-router-dom';
import {Button, Modal, TextField, Card,  CardContent} from '@material-ui/core/';
import {useState, useEffect} from 'react';

import {db} from './firebase';
import axios from 'axios';

export default function ProjectDetails() {

    let location = useLocation();

    let data = location.query.projectInfo;

    console.log(data)

    
    const [showAddProgrammer, setShowAddProgrammer] = useState(false);
    const [programmerProperties, setProgrammerProperties] = useState({
        programmerName: '',
        programmerContact: '',
        programmerPersonality: '',
        programmerSkills: '',
        programmerLanguages: '',
        programmerWishes: ''
      });

    const handleChangeProgrammer = e => {
        setProgrammerProperties(prevState => ({
          ...prevState,
          [e.target.name]: e.target.value
        }
        ))
      }

      const sendMail = async() => {
          let  currProjectHeadEmail = location.query.projectInfo.projectHeadContact;
          let currProjectName = location.query.projectInfo.projectName;
        let params = {
          currProjectHeadEmail,
          currProjectName,
          programmerProperties
        };
        axios.post( 'http://localhost:4242/sendmail',  params )
      }

      const addProgrammerForm = async e => {
        e.preventDefault();
        if (Object.values(programmerProperties).every(e => e)) {
         await db.collection('programmers').add(programmerProperties);
         
            
        let currProject = location.query.id;
         const projectRef = await db.collection('projects').doc(currProject).get();
         const data = await projectRef.data();
         data.ProjectParticipants.push(programmerProperties);
         await db.collection('projects').doc(currProject).set(data);
         
         
         sendMail();
         setShowAddProgrammer(false);
       } else {
         alert('Пожалуйста, заполните все поля')
       }
        
        
         }

    

    return (
        <div className="project-details">
            <Card>
                <CardContent>
                  <h1>{location.query.projectInfo.projectName}</h1>
                  <p>{location.query.projectInfo.projectDescription}</p>
                  <p>Языки, используемые в проекте: {location.query.projectInfo.projectLanguages}</p>
                  <p>В проекте требуются следующие специалисты: {location.query.projectInfo.projectSpecialists}</p>
                  <p>Руководитель проекта: {location.query.projectInfo.projectHeadName}</p>
                  <p>Контакт руководителя проекта: {location.query.projectInfo.projectHeadContact}</p>
                  <p>Чат проекта: {location.query.projectInfo.projectChat}</p>
                  <p>Участники: {location.query.projectInfo.ProjectParticipants.length > 0 ? location.query.projectInfo.ProjectParticipants.map(e => `Имя: ${e.programmerName} Контакт: ${e.programmerContact}`).join(', ') : 'Пока что участников нет'}     </p>
                  Здесь будут дополнительные детали проекта 
                  <div className="project-details__btn-container">
                  <Button
                   color="primary"
                   variant="contained"
                   className='app__projectslist__btns__participate-btn'
                   onClick={() => setShowAddProgrammer(true)}>
                    Хочу принять участие в проекте 
                  </Button>
                  </div>
            </CardContent>
            </Card>
            <Modal 
          className="app__projectslist__modal"
          open={showAddProgrammer}
          >
            <form className="app__projectslist__modal__form" noValidate onSubmit={ (e) => addProgrammerForm(e) }> 
        <div className='app__projectslist__modal__form__inner'>
        <Button 
            color="primary"
            onClick={() => setShowAddProgrammer(false)}
          >
            Закрыть
          </Button>
         
          <TextField required label="Имя программиста" name='programmerName' className='app__projectslist__modal__form__inner__field' onChange={(e) => handleChangeProgrammer(e)} />
          <TextField required label="Как можно связаться" name='programmerContact' className='app__projectslist__modal__form__inner__field' onChange={(e) => handleChangeProgrammer(e)}/>
          <TextField required label="О себе" name='programmerPersonality'  className='app__projectslist__modal__form__inner__field' onChange={(e) => handleChangeProgrammer(e)}/>
          <TextField required label="Скиллы" name='programmerSkills' className='app__projectslist__modal__form__inner__field' onChange={(e) => handleChangeProgrammer(e)}/>
          <TextField required label="Языки программирования" name='programmerLanguages'  className='app__projectslist__modal__form__inner__field' onChange={(e) => handleChangeProgrammer(e)}/>
          <TextField required label="С чем хотелось бы работать?" name='programmerWishes'  className='app__projectslist__modal__form__inner__field' onChange={(e) => handleChangeProgrammer(e)}/>
          <Button 
            color="primary"
            type="submit"
          >
            Сохранить и закрыть
          </Button>
        </div>
    </form>

          </Modal>
        </div>
    )
}