//API
const url = 'https://vue3-course-api.hexschool.io'; //站點
const path = 'vue_api_work'; //路徑

//Dom
const usernameInput= document.querySelector('#username');
const passwordInput= document.querySelector('#password');
const loginBtn= document.querySelector('#login');
const productList= document.querySelector('#productList');
const productCount= document.querySelector('#productCount');
const enableBtn= document.querySelectorAll('.enableBtn');


//登入頁面
//監聽狀態
loginBtn.addEventListener('click',login)
//API串接
function login(){
  //取帳密參數
  const username= usernameInput.value;
  const password= passwordInput.value;
  //建立物件，帶入參數
  const loginData={
    username,
    password,
  }
  //console.log(logindata);
  //POST請求
  axios.post(`${url}/admin/signin`,loginData)
  .then((res)=>{
    if(res.data.success){
      //console.log(res);
      const token= res.data.token; //憑證
      const expired= res.data.expired; //到期日
      //儲存cookie，帶入token (token名稱可自定義)
      document.cookie = `token=${token}; expires=${new Date(expired)}/`;
    } else {
      alert ('請再試一次');
    } 
    return;
  }) 
};


//商品列表
const app={
  data:{
    //產品陣列
    producted:[],
  },
  //GET請求
  getData(){
    axios.get(`${url}/api/${path}/products`)
      .then((res) => {
        //console.log(res);
      if(res.data.success) {
        this.data.producted = res.data.products;
        //console.log(this.data.producted);
        //get到產品列表後渲染畫面
        this.render();
      }
    })
  },
  render(){
    //產品字串
    let str= "";   
    //將產品列表跑forEash
    this.data.producted.forEach((i)=> {
      str+=`
      <tr>
        <td>${i.title}</td>
        <td>${i.origin_price}</td>
        <td>${i.price}</td>
        <td><button type="button" class="btn btn-sm btn-outline-primary">${i.is_enabled ? "已啟用" : "未啟用"}</button></td>
        <td><button type="button" class="btn btn-sm btn-outline-danger move deleteBtn" data-action="remove" data-id=${i.id}"> 刪除 </button></td>      
      </tr>
      `     
    })
    //console.log(str);
    //渲染產品列表
    productList.innerHTML= str;
    //渲染產品數量
    productCount.textContent = this.data.producted.length;
    //監聽刪除按鈕
    const deleteBtn= document.querySelectorAll('.deleteBtn');
    deleteBtn.forEach ((btn)=> {
      btn.addEventListener('click',this.deleteProduct)
    })
  },
  //刪除商品
  deleteProduct (e){
    //測試取商品id
    console.log('deleteProduct',e.target.dataset.id);
    const id= e.target.dataset.id;
    //DELET請求
    axios.delete(`${url}/api/${path}/cart/${id}`)
    .then((res)=>{
      console.log(res.data);
      alert ('已刪除');
      this.getData();
    })
  },
   init(){
    //取cookie
    const token=document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    //console.log(token);
    axios.defaults.headers.common['Authorization'] = token;
    this.getData();
  },   
}
app.getData();