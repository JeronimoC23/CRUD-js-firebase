const db = firebase.firestore();

const taskform = document.getElementById("task-form");
const tasksConteiner = document.getElementById("tasks-conteiner");


let editStatus = false;
let id = "";





const saveTask = (title, description) => 
    db.collection("tasks").doc().set({
        title: title,
        description:description
});
const getTasks = () => db.collection('tasks').get();
const getTask = (id) =>  db.collection('tasks').doc(id).get();
const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback);
const deleteTask = id => db.collection('tasks').doc(id).delete();
const updateTask = (id, updatedTask) => 
    db.collection('tasks').doc(id).update(updatedTask);


window.addEventListener('DOMContentLoaded',async (e) =>{
    onGetTasks((querySnapShot)=>{
    tasksConteiner.innerHTML ="";
        querySnapShot.forEach(doc =>{
            console.log(doc.data());
            const task = doc.data();
            task.id = doc.id;
    
            tasksConteiner.innerHTML += `<div class="card card-body mt-2
            border-primary">
            <h5> ${task.title} </h5>
            <p> ${task.description} </p>
            
            <button class="btn btn-primary btn-delete mb-2" data-id="${task.id}" > Delete </button>
            <button class="btn btn-primary btn-edit" data-id="${task.id}"> Edit </button>
            
            </div>`;

            const btnsDetele = document.querySelectorAll('.btn-delete')
            btnsDetele.forEach(btn => {
                btn.addEventListener('click', async(e) =>{
                    await deleteTask(e.target.dataset.id);
                })
            })

            const btnsEdit = document.querySelectorAll('.btn-edit')
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async(e) =>{
                    const doc = await getTask(e.target.dataset.id);
                    const task = doc.data();

                    editStatus = true;
                    id = doc.id;

                    taskform['task-title'].value = task.title;
                    taskform['task-description'].value = task.description;
                    taskform['btn-task-form'].innerText = "Update";
                })
            })
        })
    })

    
})


taskform.addEventListener("submit",async (e)=>{
    e.preventDefault();

    const title = taskform["task-title"];
    const description = taskform["task-description"];

    if (editStatus = false){
        await saveTask(title.value, description.value);
    }else {
        await updateTask(id, {
            title: title.value,
            description: description.value
        });
        editStatus = false;
        id= "";
        taskForm['btn-task-form'].innerText ="Save"
    }
 

    taskform.reset();
    title.focus();

})

