let form = document.querySelector('#my-form');
let amount = document.querySelector('#amount');
let description = document.querySelector('#description');

var getAllProducts = [];

let count = 0;

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    count++;

    let expense = {
        amount : amount.value,
        description : description.value,
    }


    document.querySelector('#my-form').reset();

    const expenseSeralized = JSON.stringify(expense);
    localStorage.setItem(count+'. '+expense.amount + expense.description, expenseSeralized);


    //axios post request using crudcrud
    axios.post('https://crudcrud.com/api/66b6ce22ba504df08f3a534803387faf/productDetails', expense)
        .then((res) => {
            console.log(res);
            getAllProducts.push(res.data)
            totalPrice();
        })
        .catch((err) => {
            console.error(err);
        })
        
    addListOfProducts(expense);
})


//creating list of products in html doc
function addListOfProducts(expense) {

    var userId = expense._id;
  
    console.log(userId);
  
    const parentNode = document.getElementById("items");

    const childHTML = `<li id=${expense._id}> ${expense.amount} ${expense.description} <button onclick=deleteUser('${expense._id}')>delete</button></li>`;

    console.log(childHTML);
  
    parentNode.innerHTML = parentNode.innerHTML + childHTML;
  
}


//to delete the product details in crud
function deleteUser(userId){

    removeProduct(userId);

    

    axios.delete(`https://crudcrud.com/api/66b6ce22ba504df08f3a534803387faf/productDetails/${userId}`)
            .then((res) => {
                console.log(res);
                var filteredArr = getAllProducts.filter((n) => 
                    n._id !== userId    
                )

                getAllProducts = filteredArr;
                totalPrice();

            })
            .catch((err) => {
                console.log(err);
            })
}


function removeProduct(userId){
    const parentNode = document.getElementById('items');
    const childNodeToBeDeleted = document.getElementById(userId);

    if(childNodeToBeDeleted){
        parentNode.removeChild(childNodeToBeDeleted);
    }
}

function showExpense(){
    axios.get('https://crudcrud.com/api/66b6ce22ba504df08f3a534803387faf/productDetails')
        .then((res) => {

            console.log(res);
            getAllProducts = res.data;
            totalPrice();
            
            for(let i = 0; i < res.data.length; i++){
                addListOfProducts(res.data[i]);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

function totalPrice(){
    let sum = 0;

    for(let i=0; i< getAllProducts.length; i++){
        sum+= parseInt(getAllProducts[i].amount);
    }

    const parentNode1 = document.getElementById("totalPrice-head");
    parentNode1.innerHTML = `The total value of product is: ${sum}`;
}

showExpense();