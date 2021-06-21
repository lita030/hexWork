//(ESN) import Vue creatApp模組
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';

// 定義接近全域變數
let productModal = '';
let delProductModal= ''; 

const app = createApp({
    data() {
        return {
        apiUrl: 'https://vue3-course-api.hexschool.io/api', //API站點
        apiPath: 'vue_lita', //API路徑
        // 存產品列表欄位
        products: [],
        // 判斷新增or編輯 modal
        isNew:'false',
        // 稍後調整資料使用的結構
        tempProduct: { 
            //imagesUrl: [],
        },
        }
    },
    mounted() {
        //取得cookie
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        //把token加入headers -> 能正確取得遠端資料
        axios.defaults.headers.common['Authorization'] = token;
        // Bootstrap 實體：https://getbootstrap.com/docs/5.0/components/modal/
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal= new bootstrap.Modal(document.getElementById('delProductModal'));
        this.getProducts();

    },
    methods: {
        getProducts() {
            const getApi = `${this.apiUrl}/${this.apiPath}/admin/products`;
            //發出get請求取商品列表
            axios.get(getApi)
                .then((res) => {
                console.log(res.data.products);
                if (res.data.success) {
                this.products = res.data.products
                } else {
                alert('請再試一次');
                }
            })
        },
        openModal(isNew,i){
            if(isNew === 'true'){
                this.tempProduct={ 
                    //imagesUrl: [],
                };
                productModal.show();
            } else if (isNew === 'false'){
                this.tempProduct={ ...i };
                productModal.show();
            } else if (isNew === 'delete'){
                this.tempProduct = { ...i };
                delProductModal.show();
            }

            
        },
        updateProduct(){ 
            //新增
            let urlApi= `${this.apiUrl}/${this.apiPath}/admin/product`;
            //POSTorPUT請求
            let method = 'post';
            //編輯
            if (!this.isNew){
                urlApi= `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                method= `put`;
            }
            //發出請求
            axios[method](urlApi, {data: this.tempProduct})
                .then((res)=> {
                    console.log(res.data)
                    if (res.data.success){
                        this.getProducts();
                        productModal.hide();
                    }
                })
        },
        deleteProduct(){
            //刪除
            const deleteApi= `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(deleteApi)
            .then((res)=>{
                console.log(res.data)
                if(res.data.success){
                    alert(res.data.message);
                    delProductModal.hide();
                    this.getProducts();
                } else{
                    alert(res.data.message);
                }
                
            }) 
        }
    },
    
});

app.mount('#app');