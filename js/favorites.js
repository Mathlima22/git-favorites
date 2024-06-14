
import { GithubUser } from "./githubUser.js"

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites{

    constructor(root){
    this.root = document.querySelector(root)
    this.load()
    }
    
    load() {
        this.entries = JSON.parse(localStorage.getItem('@githubfavorites:')) || []
        //JSON.parse transforma a string que seria gerada pelo JSON no função correta
        //localStorage é uma API do browser que funciona como um specie de banco de dados
        
    }

    save(){
        localStorage.setItem('@githubfavorites:', JSON.stringify(this.entries))
    }
    async add(username) {
        try{

            const userExists = this.entries.find(entry => entry.login === username)
            
            if(userExists){
                throw new Error('Usuário ja Cadastrado')
            }

            const user = await GithubUser.search(username)

            if(user.login === undefined){
                throw new Error ('Usuário não encontrado')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        } 
        catch(error){
            alert(error.message)
        }

    }
    // Higher-order function (map, filter, find, reduce..)
    delete(user){
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
        
        this.entries = filteredEntries
        this.update()
        this.save()
    }
}
// classe que vai criar a visualização e eventos no HTML

export class FavoritesView extends Favorites {
    // o super chama a função constructor da class Favorites para substituir o root por #app
    constructor(root){
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
            addButton.onclick = () => {
                const {value} = this.root.querySelector('.search input')
                this.add(value)
            }
            
        }

    update() {
        this.removeAllTr()

       
    
    this.entries.forEach((user) => {
        const row = this.createRow()

        row.querySelector('.user img').src = `https://github.com/${user.login}.png`
        row.querySelector('.user img').alt = `Imagem de ${user.name}`
        row.querySelector('.user p').textContent = user.name
        row.querySelector('.user a').href = `https://github.com/${user.login}`
        row.querySelector('.user span').textContent = user.login
        row.querySelector('.repositories').textContent = user.public_repos
        row.querySelector('.followers').textContent = user.followers

        row.querySelector('.remove').onclick = () => {
            const isOk = confirm('Tem certeza que deseja deletar essa linha?')

            if(isOk){
                this.delete(user)
            }
        }

        this.tbody.append(row)
    })

   
    }

    createRow(){
        const tr = document.createElement('tr')

        tr.innerHTML = `
                <td class="user">
                    <img src="https://github.com/Mathlima22.png" alt="">
                    <a href="https://github.com/Mathlima22"></a>
                    <p></p>
                    <span></span>
                </td>
                <td class="repositories">
                    22
                </td>
                <td class="followers">
                    750
                </td>
                <td>
                    <button class="remove">&times;</button>
                </td> 
                `
        return tr
    }

    removeAllTr(){
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }
}