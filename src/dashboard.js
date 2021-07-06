import react from 'react'
import './App.css';


import {Button, Modal, TextField, Card,  CardContent, Snackbar} from '@material-ui/core/';
import {Link as LinkScroll, Element, animateScroll as scroll} from 'react-scroll'
import AddIcon from '@material-ui/icons/Add';
import {Link} from 'react-router-dom';
import ProjectDetails from './projectdetails'
import Alert from '@material-ui/lab/Alert';

import {useState, useEffect} from 'react';

import {db} from './firebase';
import axios from 'axios';


export default function Dashboard() {
    const [showAddProject, setShowAddProject] = useState(false);
    const [showAddProgrammer, setShowAddProgrammer] = useState(false);
    const [currProject, setCurrProject] = useState(null);
    const [currProjectHeadEmail, setCurrProjectHeadEmail] = useState(null);
    const [currProjectName, setCurrProjectName] = useState(null);
    const [edit, setEdit] = useState(false);
    const [editSucess, setEditSucess] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [addProgrammerSuccess, setAddProgrammerSuccess] = useState(false);
    const [programmerProperties, setProgrammerProperties] = useState({
      programmerName: '',
      programmerContact: '',
      programmerPersonality: '',
      programmerSkills: '',
      programmerLanguages: '',
      programmerWishes: ''
    });
  
    const [projectProperties, setProjectProperties] = useState(
      {
        projectName: '',
        projectDescription: '',
        projectHeadEmail: '',
        projectHeadContact: '',
        projectHeadName: '',
        projectChat: '',
        projectSpecialists: '',
        projectLanguages: '',
        ProjectParticipants: []
      }
    );

    
  
    const [projectsList, setProjectsList] = useState([]);

    

    
  
    useEffect(() => {
      getProjects();
    },[]);
  
    const sendMail = async() => {
      let params = {
        currProjectHeadEmail,
        currProjectName,
        programmerProperties
      };
      console.log(window.location.origin);
      axios.post(`${window.location.origin}/sendmail`,  params )
    }
  
    const addProgrammerForm = async e => {
     e.preventDefault();
     if (Object.values(programmerProperties).every(e => e)) {
      await db.collection('programmers').add(programmerProperties);
      
  
  
      const projectRef = await db.collection('projects').doc(currProject).get();
      const data = await projectRef.data();
      data.ProjectParticipants.push(programmerProperties);
      await db.collection('projects').doc(currProject).set(data);
      
      getProjects();
      sendMail();
      setShowAddProgrammer(false);
      setAddProgrammerSuccess(true);
    } else {
      alert('Пожалуйста, заполните все поля')
    }
     
     
      }
  
    const handleChange = e => {
      
      setProjectProperties(prevState => (
        { ...prevState,
        [e.target.name]: e.target.value
      }))
    }
  
    const handleChangeProgrammer = e => {
      setProgrammerProperties(prevState => ({
        ...prevState,
        [e.target.name]: e.target.value
      }
      ))
    }
    const getProjects = async()=> {
      const projectsRef = await db.collection('projects').get();
      let projectsRefList = [];
      projectsRef.forEach(doc => projectsRefList.push([doc.data(), doc.id]));
      setProjectsList(projectsRefList);
    }
  
    const formSubmit = async e => {
      e.preventDefault();
      if (!edit) {
        if (Object.values(projectProperties).every(e => e)) {
          await db.collection('projects').add(projectProperties);
          getProjects();
          setShowAddProject(false);
          setAddSuccess(true);
          } else {
            alert('Пожалуйста, заполните все поля');
          }
      } else {

        await db.collection('projects').doc(edit).set(projectProperties);
        setProjectProperties(null);
        setEdit(false);
        setShowAddProject(false);
        getProjects();
        setEditSucess(true);
      }
    }
  
    const currSave = (id, email, projectName) => {
      setCurrProject(id);
      setCurrProjectHeadEmail(email);
      setCurrProjectName(projectName);
      setShowAddProgrammer(true);
    }

    const currChange = async id => {
      setShowAddProject(true);
      setEdit(id)
      const found = projectsList.find(e => e[1] == id);
      setProjectProperties(found[0]);
    }
    return (
        <div className="app">
          <h1>Проекты</h1>
          <Snackbar open={addProgrammerSuccess} autoHideDuration={6000} onClose={() => setAddProgrammerSuccess(false)}><Alert severity="success">Вы успешно добавились в команду проекта. Руководителю проекта направлено письмо.</Alert></Snackbar>
          <Snackbar open={addSuccess} autoHideDuration={6000} onClose={() => setAddSuccess(false)}><Alert severity="success">Вы успешно добавили новый проект. Не забудьте также добавить команду на вкладке "Команды" наверху.</Alert></Snackbar>
          <Snackbar open={editSucess} autoHideDuration={6000} onClose={() => setEditSucess(false)}><Alert severity="success">Вы успешно отредактировали проект.</Alert></Snackbar>
        <div className="app__addproject">
          <Button 
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowAddProject(true)}
            className='app__addproject__btn'
            >
              Добавить новый проект
            </Button>
      </div>
            <Modal
        className='app__addproject__modal'
        open={showAddProject}
      >
        <form className="app__addproject__modal__form" noValidate autoComplete="off" onSubmit={ (e) => formSubmit(e) }> 
        <div className='app__addproject__modal__form__inner'>
        <Button 
            color="primary"
            onClick={() => setShowAddProject(false)}
          >
            Закрыть
          </Button>
         
          <TextField required label="Название проекта" name='projectName' className='app__addproject__modal__form__inner__field' value={projectProperties?.projectName} onChange={(e) => handleChange(e)}  />
          <TextField required label="Описание проекта" name='projectDescription' className='app__addproject__modal__form__inner__field' value={projectProperties?.projectDescription} onChange={(e) => handleChange(e)}/>
          <TextField required label="Имя руководителя проекта" name='projectHeadName'  className='app__addproject__modal__form__inner__field' value={projectProperties?.projectHeadName} onChange={(e) => handleChange(e)}/>
          <TextField required label="E-mail руководителя проекта" name='projectHeadEmail' className='app__addproject__modal__form__inner__field' value={projectProperties?.projectHeadEmail} onChange={(e) => handleChange(e)}/>
          <TextField required label="Контакт руководителя проекта" name='projectHeadContact'  className='app__addproject__modal__form__inner__field' value={projectProperties?.projectHeadContact} onChange={(e) => handleChange(e)}/>
          <TextField required label="Чат проекта" name='projectChat'  className='app__addproject__modal__form__inner__field' value={projectProperties?.projectChat} onChange={(e) => handleChange(e)}/>
          <TextField required label="Требуемые специалисты в проект" name='projectSpecialists' className='app__addproject__modal__form__inner__field' value={projectProperties?.projectSpecialists} onChange={(e) => handleChange(e)}/>
          <TextField required label="Языки, используемые в проекте" name='projectLanguages' className='app__addproject__modal__form__inner__field' value={projectProperties?.projectLanguages} onChange={(e) => handleChange(e)}/>
          
          <Button 
            color="primary"
            type="submit"
          >
            Сохранить и закрыть
          </Button>
        </div>
    </form>
      </Modal>


      <div className="app__projectslist">
        {
          projectsList.map(e => {
            
            return (
              <Card>
                <CardContent>
                  <h1>{e[0].projectName}</h1>
                  <p>{e[0].projectDescription}</p>
                  <p>Языки, используемые в проекте: {e[0].projectLanguages}</p>
                  <p>В проекте требуются следующие специалисты: {e[0].projectSpecialists}</p>
                  <p>Руководитель проекта: {e[0].projectHeadName}</p>
                  <p>Контакт руководителя проекта: {e[0].projectHeadContact}</p>
                  <p>Чат проекта: {e[0].projectChat}</p>
                  <p>Участники: {e[0].ProjectParticipants?.length > 0 ? e[0].ProjectParticipants.map(e => `Имя: ${e.programmerName} Контакт: ${e.programmerContact}`).join(', ') : 'Пока что участников нет'}     </p>
                  <div className="app__projectslist__btns">
                  <Link to={{ pathname: '/projectdetails', query: {
                      id: e[1],
                      projectInfo: e[0]
                   } }}>
                  <Button 
                    color='secondary'
                    variant='contained'
                    >
                        Подробная информация о проекте
                    </Button>
                    </Link>
                  <Button
                   color="primary"
                   variant="contained"
                   className='app__projectslist__btns__participate-btn'
                   onClick={() => currSave( e[1], e[0].projectHeadEmail, e[0].projectName)}>
                    Хочу принять участие в проекте 
                  </Button>
                  <Button
                   color="primary"
                   variant="contained"
                   className='app__projectslist__btns__participate-btn'
                   onClick={() => currChange( e[1])}>
                    Изменить проект 
                  </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        }

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
      
      </div>
    )
   
}

