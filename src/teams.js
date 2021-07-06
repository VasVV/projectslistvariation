import react from 'react';
import {useState, useEffect} from 'react';
import {Button, Modal, TextField, Card,  CardContent, Snackbar} from '@material-ui/core/';
import Alert from '@material-ui/lab/Alert';
import AddIcon from '@material-ui/icons/Add';
import {db} from './firebase';

export default function Teams() {

    const [teamsList, setTeamsList] = useState([]);
    const [showAddTeam, setShowAddTeam] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editSucess, setEditSucess] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [teamProperties, setTeamProperties] = useState({
        teamNumber: '',
        teamLeader: '',
        status: '',
        formalization: '',
        stack: '',
        instruments: '',
        teamMembers: '',
        businessModel: '',
        storyTelling: '',
        mvp: '',
        logic: '',
        testing: '',
        arhitecture: '',
        development: '',
    });

    useEffect(() => {
        getTeams()
    }, []);

    const currChange = async id => {
        setShowAddTeam(true);
        setEdit(id)
        const found = teamsList.find(e => e[1] == id);
        setTeamProperties(found[0]);
      }

    const handleChange = e => {
        setTeamProperties(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    };

    const getTeams = async() => {
      const teamsRef = await db.collection('teams').get();
      let teamsRefList = [];
      teamsRef.forEach(doc => teamsRefList.push([doc.data(), doc.id]));
      setTeamsList(teamsRefList);
    }

    const formSubmit = async e => {
        e.preventDefault();
        if (!edit) {
            await db.collection('teams').add(teamProperties);
            getTeams();
            setShowAddTeam(false);
            setAddSuccess(true);
        } else {
            await db.collection('teams').doc(edit).set(teamProperties);
            setEdit(false);
            setShowAddTeam(false);
            setTeamProperties(null);
            getTeams();
            setEditSucess(true);
        }
    }
    return (
        <div className="teams">
            <h1>Команды</h1>
            <Snackbar open={addSuccess} autoHideDuration={6000} onClose={() => setAddSuccess(false)}><Alert severity="success">Вы успешно создали новую команду. Не забудьте также добавить проект на вкладке "Главная страница" наверху.</Alert></Snackbar>
            <Snackbar open={editSucess} autoHideDuration={6000} onClose={() => setEditSucess(false)}><Alert severity="success">Вы успешно изменили команду.</Alert></Snackbar>
            <Button 
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowAddTeam(true)}
            className='app__addproject__btn'
            >
              Добавить новую команду
            </Button>
            <Modal
        className='app__addproject__modal'
        open={showAddTeam}
      >
        <form className="app__addproject__modal__form" noValidate autoComplete="off" onSubmit={ (e) => formSubmit(e) }> 
        <div className='app__addproject__modal__form__inner'>
        <Button 
            color="primary"
            onClick={() => setShowAddTeam(false)}
          >
            Закрыть
          </Button>
          <TextField label="Номер команды" name='teamNumber' value={teamProperties?.teamNumber} className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)} />
          <TextField  label="Лидер команды" name='teamLeader' value={teamProperties?.teamLeader} className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField  label="Стадия, на которой находится проект" value={teamProperties?.status} name='status'  className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField  label="Формализация идеи проекта" name='formalization' value={teamProperties?.formalization} className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField  label="Технологический стек" name='stack' value={teamProperties?.stack}  className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField  label="Используемые инструменты" name='instruments' value={teamProperties?.instruments} className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField  label="Состав команды и распределение ролей, матрица RACI" name='teamMembers' value={teamProperties?.teamMembers} className='app__addproject__modapp__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField  label="Бизнес-модель по шаблону Остервальдера" name='businessModel' value={teamProperties?.businessModel} className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField  label="Сторителлинг от лица внутреннего и внешнего пользователя" name='storyTelling' value={teamProperties?.storyTelling} className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField  label="Описание требований к продукту и их приоритизация, определение MVP" name='mvp' value={teamProperties?.mvp} className='app__app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField  label="Проектирование логики работы продукта" name='logic' value={teamProperties?.logic} className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField  label="Проектирование архитектуры программного продукта" name='arhitecture' value={teamProperties?.arhitecture} className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <TextField  label="Разработка составных частей и программных интерфейсов" name='development' value={teamProperties?.development} className='app__addproject__modal__form__inner__field' onChange={(e) => handleChange(e)}/>
          <Button 
            color="primary"
            type="submit"
          >
            Сохранить и закрыть
          </Button>
        </div>
    </form>
      </Modal>
            {teamsList.map(e => {
                return (
                    <Card>
                        <CardContent>
                            <h1>Команда номер {e[0].teamNumber}</h1>
                            <p>Лидер команды: {e[0].teamLeader}</p>
                            <p>Стадия, на которой находится проект: {e[0].status}</p>
                            <p>Формализация идеи проекта: {e[0].formalization}</p>
                            <p>Технологический стек: {e[0].stack}</p>
                            <p>Используемые инструменты: {e[0].instruments}</p>
                            <p>Состав команды и распределение ролей, матрица RACI: {e[0].teamMembers}</p>
                            <p>Бизнес-модель по шаблону Остервальдера: {e[0].businessModel}</p>
                            <p>Сторителлинг от лица внутреннего и внешнего пользователя: {e[0].storyTelling}</p>
                            <p>Описание требований к продукту и их приоритизация, определение MVP: {e[0].mvp}</p>
                            <p>Проектирование логики работы продукта: {e[0].logic}</p>
                            <p>Подготовка документации для тестирования: {e[0].testing}</p>
                            <p>Проектирование архитектуры программного продукта: {e[0].arhitecture}</p>
                            <p>Разработка составных частей и программных интерфейсов: {e[0].development}</p>
                            <Button
                                color="primary"
                                variant="contained"
                                className='app__projectslist__btns__participate-btn'
                                onClick={() => currChange( e[1])}>
                                    Изменить команду
                                </Button>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}