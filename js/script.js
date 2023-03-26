let addInput = document.querySelector('.input')
let addButton = document.querySelector('.btn')
let todo = document.querySelector('.to-do')
let out = document.querySelector('.out')
console.log(todo)

let todoList = []

if (localStorage.getItem('todo')) {
   todoList = JSON.parse(localStorage.getItem('todo'))
   displayMessage()
}

addButton.addEventListener('click', function () {
   if (addInput.value !== '') {
      let newTodo = {
         id: Date.now(),
         todo: addInput.value,
         checked: false,
         important: false
      }
   
      todoList.push(newTodo)
   }
   displayMessage()
   localStorage.setItem('todo', JSON.stringify(todoList))
   addInput.value = ''
})


function displayMessage() {
   let displayMessage = ''
   if(todoList.length === 0) todo.innerHTML = ''
   todoList.forEach(function (item, index) {
       displayMessage += `
      <li id=${item.id} class="to-do-li">
      <input type='checkbox' id='item__${index}' ${item.checked ? 'checked' : ''}>
      <label for= 'item__${index}'class = "${item.important ? 'active' : ''}">${item.todo}</label>
      <button data-action="delete" class = "out">X</button>
      </li>
      `;
      
      todo.innerHTML = displayMessage
   })
}

todo.addEventListener('change', function (ev) {
   let idInput = ev.target.getAttribute('id')
   let forLabel = todo.querySelector('[for=' + idInput + '] ')
   let valueLabel = forLabel.innerHTML
   todoList.forEach(function (item) {
      if (item.todo === valueLabel) {
         item.checked = !item.checked
         localStorage.setItem('todo', JSON.stringify(todoList))
      }
   })
})
todo.addEventListener('contextmenu', function (event) {
   event.preventDefault()
   todoList.forEach(function (item) {
      if (item.todo === event.target.innerHTML) {
         item.important = !item.important
         displayMessage()
         localStorage.setItem('todo', JSON.stringify(todoList))
      }
   })
})

todo.addEventListener('click', deleteTask)

function deleteTask(event) {
   if (event.target.dataset.action === 'delete') {
      let parentNode = event.target.closest(".to-do-li")
      const id = Number(parentNode.id)
     const index =  todoList.findIndex((task) =>  task.id === id)
      todoList.splice(index, 1)

       localStorage.setItem('todo', JSON.stringify(todoList))
      parentNode.remove()
   }
}

//=============================================

//canvas vanilla.js
(() => {
   const cnv = document.querySelector('canvas')
   const ctx = cnv.getContext('2d')
   const cfg = {
      orbsCount: 400,
      minVelocity: .2,
      ringsCount : 10,
   }

   let mx = 0, my = 0
   cnv.addEventListener(`mousemove`, e => {
      mx = e.clientX - cnv.getBoundingClientRect().left
      my = e.clientY - cnv.getBoundingClientRect().top
   })

   let cw, ch, cx, cy, ph, pw
   function resize() {
      cw = cnv.width = innerWidth
      ch = cnv.height = innerHeight
      cx = cw * .5
      cy = ch * .5
      ph = cy * .4
      pw = cx * .4
   }
   resize()
   window.addEventListener('resize', resize)
   class Ord{
      constructor() {
         this.size = Math.random()* 5 + 2
         this.angle = Math.random() * 360
         this.radius = (Math.random() * cfg.ringsCount | 0) * ph / cfg.ringsCount
         this.impact = this.radius / ph
         this.velocity = cfg.minVelocity + Math.random() * cfg.minVelocity // + this.impact
         
      }
      refresh() {
         let radian = this.angle * Math.PI / 180
         let cos = Math.cos(radian)
         let sin = Math.sin(radian)

         let offsetX = cos * pw * this.impact
         let offsetY = sin * pw * this.impact

         let parallaxX = mx / cw * 2 - 1
         let parallaxY = my / ch 

         let x = cx + cos * (ph + this.radius) + offsetX
         let y = cy + sin * (ph + this.radius) - offsetY * parallaxY - parallaxX * offsetX

         let distToC = Math.hypot(x - cx, y - cy)
         let distToM = Math.hypot(x - mx, y - my)

         let optic = sin * this.size * this.impact * .7
         let mEffect = distToM<= 50 ? (1 - distToM / 50) * 25 : 0
         let size = this.size + optic + mEffect

         let h = this.angle
         let s = 100
         let l = (1 - Math.sin(this.impact * Math.PI)) * 90 + 10
         let color = `hsl(${h}, ${s}%, ${l}% )`

         if (distToC > ph - 1 || sin> 0) {
          ctx.strokeStyle = ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(x, y, size, 0, 2 * Math.PI)
           distToM <= 50 ? ctx.stroke() : ctx.fill()
         }
         this.angle = (this.angle - this.velocity) % 360
      }
   }

//  new Ord().refresh()


   let orbsList = []
   function createStarDust() {
      for (let i = 0; i < cfg.orbsCount; i++) {
        orbsList.push(new Ord())
         
      }
   }
   createStarDust()

   let bg1 = ctx.createLinearGradient(cx, cy, 0, cx, cy, cx)
   bg1.addColorStop(0, `rgb(21,22,20, 0.8)`)
   bg1.addColorStop(0.7, `rgb(82,10,74, 0.94)`)
   bg1.addColorStop(1, `rgb(30,10,50)`)

   function loop() {
      requestAnimationFrame(loop)
      ctx.globalCompositeOperation = `normal`
       ctx.fillStyle = bg1
      ctx.fillRect(0, 0, cw, ch)
      ctx.globalCompositeOperation = `lighter`
      orbsList.map(e => e.refresh())
   }
   loop()






})()

 