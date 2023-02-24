//Constante de controle da imagem dos personagens
const imagem = document.querySelector("#imagemPerson");

//Input de controle de entrada de informações
const formName = document.querySelector("#form"); //Form
const inputName = document.querySelector("#name"); //Input

//Buttons de controle de avanço e regresso das informações
const buttonPrev = document.querySelector("#prev");
const buttonNext = document.querySelector("#next");

//Elemento de apresentação das informações 
const element = document.querySelector(".textPerson");

//Controle da variável id
let nextId = 0;

//Variável de controle do fetch
let response;

//Função de carregamento das informações
function loding (){
    element.innerHTML = `
    <h3><span>Name:</span> Loading... </h3>
    <h3><span>Status:</span> Loading... </h3>
    <h3><span>Species:</span> Loading... </h3>
    <h3><span>Origin:</span> Loading... </h3>
    <h3><span>Created:</span> Loading... </h3>`
}

//Função de erro, caso não seja encontrado o personagem
function notFound (){
    imagem.setAttribute("src", `./imagem/notFound.jpg`);
        element.innerHTML = `
            <h3><span>Name:</span> Not Found </h3>
            <h3><span>Status:</span> Not Found </h3>
            <h3><span>Species:</span> Not Found </h3>
            <h3><span>Origin:</span> Not Found </h3>
            <h3><span>Created:</span> Not Found </h3>`
}

//Função assicrona para chamar os elementos
const APIresponse = async (person) =>{
    loding(); //Carregando as informações
    
    if(isNaN(person)){ //Caso o elemento passado não seja um numero
        response = await fetch(`https://rickandmortyapi.com/api/character/?name=${person}`, {
            method: 'GET',
        });
        if(response.status === 200){ //Caso não ocorra nenhum erro no status da api ou página
            const data = await response.json(); //Convertendo em json
            let num = data.results.filter(word => word.name == person); //Criando um vetor "num" e filtrando as informações com base na entrada fornecida
            let value = num.map(word => word.name == person); //Mapeando as informações fornecidas  
            if(value[0] == true){ //Caso seja compativel com o dado de entrada
                nextId = num[0].id; //Atualizando a variavel de controle do id
                return num[0]; //Retornando os dados do elemento
            }
            else{ //Caso não seja compatível (false)
                console.log("erro");
                notFound(); //Chamando a função de erro
            }
        }
    }
    else{ //Caso o elemento passado sej um numero
        response = await fetch(`https://rickandmortyapi.com/api/character/${person}`, {
            method: 'GET',
        });
        if(response.status === 200){ //Evitando erro de status
            const data = await response.json(); //Convertendo em json
            if(data){ //Caso o json apresente algum valor
                nextId = data.id; //Atualizando a variavel de controle do id
                return data; //Retornando vetor de informações do dado de entrada
            }
            else{ //Caso não apresente nenhuma informação
                console.log("erro");
                notFound(); //Chamando a função de erro
            }
        }
    }
    }

//Função para renderizar os dados e informações do personagem
const rederPerson = async (person) =>{
    loding(); //Carregando campo de informações do personagem

    const value = await APIresponse(person); //Chamando a função e passando os elementos de entrada
    if(value){ //Caso o retorno apresente algum valor 
        imagem.setAttribute("src", `https://rickandmortyapi.com/api/character/avatar/${value.id}.jpeg`); //Modifica a imagem do personagem
        //Modificando o campo de apresentação
        element.innerHTML = `
            <h3><span>Name:</span> ${value.name} </h3>
            <h3><span>Status:</span> ${value.status} </h3>
            <h3><span>Species:</span> ${value.species} </h3>
            <h3><span>Origin:</span> ${value.origin.name} </h3>
            <h3><span>Created:</span> ${value.created} </h3>`
    }
    else{ //Caso não seja retornado nenhum valor no vetor
        notFound(); //Função de erro
    }
}

//Adicioando os eventos aos elementos de interação com o usuário

//Evento do input e form
formName.addEventListener("submit", (event)=>{
    event.preventDefault();
    rederPerson(inputName.value);
    inputName.value = "";
});

//Evento do button de proximo
buttonNext.addEventListener("click", ()=>{
    nextId += 1;
    rederPerson(nextId);
});

//Evento do button de regresso
buttonPrev.addEventListener("click", ()=>{
    if(nextId > 1){
        nextId -= 1;
        rederPerson(nextId);
    }
})

