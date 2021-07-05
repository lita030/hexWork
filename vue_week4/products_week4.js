//(ESN) import Vue creatApp模組
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';
//(ESN) import 分頁元件 ->區域註冊
import pagination from './pagination.js';


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
        // 接收分頁資訊
        pagination:{},
        }
    },
    mounted() {
        //取得cookie
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        //把token加入headers -> 能正確取得遠端資料
        axios.defaults.headers.common['Authorization'] = token;
        // Bootstrap 實體：https://getbootstrap.com/docs/5.0/components/modal/
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal= new bootstrap.Modal(document.getElementById('delProductModal'));
        this.getProducts();
    },
    methods: {
        getProducts(page=1) {
            const getApi = `${this.apiUrl}/${this.apiPath}/admin/products?page=${page}`;
            //發出get請求取商品列表
            axios.get(getApi)              
                .then((res) => {
                console.log(res.data.products);
                if (res.data.success) {
                this.products = res.data.products;
                this.pagination=res.data.pagination;
                } else {
                alert('請再試一次');
                }
                })
                .catch((err)=>{
                    console.log(err);
                })
        },
        //isNew分辨新增/編輯/刪除  product：v-for
        openModal(isNew,product){
            if(isNew === 'new'){
                this.tempProduct={ 
                    //imagesUrl: [],
                };
                this.isNew=true;
                productModal.show();
            } else if (isNew === 'edit'){
                this.isNew=false;
                this.tempProduct={ ...product }; //淺層拷貝避免連動
                productModal.show();
            } else if (isNew === 'delete'){
                this.tempProduct = { ...product};
                delProductModal.show();
            }
            
        },
        updateProduct(tempProduct){ 
            //新增
            let urlApi= `${this.apiUrl}/${this.apiPath}/admin/product`;
            //POSTorPUT請求
            let method = 'post';
            //編輯
            if (!this.isNew){
                urlApi= `${this.apiUrl}/${this.apiPath}/admin/product/${tempProduct.id}`;
                method= `put`;
            }
            //發出請求
            axios[method](urlApi, {data: tempProduct})
                .then((res)=> {
                    console.log(res.data)
                    if (res.data.success){
                        this.getProducts();
                        productModal.hide();
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch((err)=>{
                    console.log(err);
                })
        },
        deleteProduct(tempProduct){
            //刪除
            const deleteApi= `${this.apiUrl}/${this.apiPath}/admin/product/${tempProduct.id}`;
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
    //分頁元件
    components:{
        pagination
    },
    
});
//互動視窗
app.component('productModal',{
    props:['tempProduct'],
    template:`<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl">
    <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
        <h5 id="productModalLabel" class="modal-title">
            <!--表單-->
            <span v-if="isNew">新增產品</span>
            <span v-else>編輯產品</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        <div class="row">
            <div class="col-sm-4">
            <div class="mb-1">
                <div class="form-group">
                <label for="imageUrl" >主要圖片</label>
                <input type="text" class="form-control"
                        placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl">
            </div>
            <!--src用v-bind綁定 tempProduct.imageUrl，輸入圖片時可看預覽圖-->
            <img class="img-fluid" :src="tempProduct.imageUrl"  alt=""> 
            </div>
            <!--新增多圖-->
            <div class="mb-1">
            <div class="form-group"></div>
            <label for="imagesUrl" >新增多圖</label>
            <input type="text" class="form-control"
                    placeholder="請輸入圖片連結" v-model="tempProduct.imagesUrl">
            </div>

            <div>
                <button class="btn btn-outline-primary btn-sm d-block w-100">
                新增圖片
                </button>
            </div>

            <div>
                <button class="btn btn-outline-danger btn-sm d-block w-100">
                刪除圖片
                </button>
            </div>
        </div>
        
        <!--表單內容-->
        <div class="col-sm-8">
            <div class="form-group">
            <label for="title" >標題</label>
            <input id="title" type="text" class="form-control" placeholder="請輸入標題" 
            v-model="tempProduct.title">
            </div>
            <div class="row">
            <div class="form-group col-md-6">
                <label for="category">分類</label>
                <input id="category" type="text" class="form-control"
                    placeholder="請輸入分類" v-model="tempProduct.category">
            </div>
            <div class="form-group col-md-6">
                <label for="price">單位</label>
                <input id="unit" type="text" class="form-control" placeholder="請輸入單位" 
                v-model="tempProduct.unit">
            </div>
            </div>
            <div class="row">
            <div class="form-group col-md-6">
                <label for="origin_price">原價</label>
                <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價"
                v-model.number="tempProduct.origin_price">
            </div>
            <div class="form-group col-md-6">
                <label for="price">售價</label>
                <input id="price" type="number" min="0" class="form-control"
                    placeholder="請輸入售價" v-model.number="tempProduct.price">
            </div>
            </div>
            <hr>
            <div class="form-group">
            <label for="description">產品描述</label>
            <textarea id="description" type="text" class="form-control"
                        placeholder="請輸入產品描述" v-model="tempProduct.description">
            </textarea>
            </div>
            <div class="form-group">
            <label for="content">說明內容</label>
            <textarea id="description" type="text" class="form-control"
                        placeholder="請輸入說明內容" v-model="tempProduct.content">
            </textarea>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input id="is_enabled" class="form-check-input" type="checkbox"
                      :true-value="1" :false-value="0" v-model="tempProduct.is_enabled">
                <label class="form-check-label" for="is_enabled" >是否啟用</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
          取消
        </button>
        <button type="button" class="btn btn-primary" @click="$emit('update-product',tempProduct)">
          確認
        </button>
      </div>
    </div>
  </div>
</div>
`,
})
app.component('delProductModal',{
    props:['tempProduct'],
    template:`<div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
    aria-labelledby="delProductModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content border-0">
      <div class="modal-header bg-danger text-white">
        <h5 id="delProductModalLabel" class="modal-title">
          <span>刪除產品</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" >
        是否刪除
        <strong class="text-danger">{{ tempProduct.title }}</strong>商品(刪除後將無法恢復)。
      </div>


      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
          取消
        </button>
        <button type="button" class="btn btn-danger" @click="$emit('delete-product',tempProduct)">
          確認刪除
        </button>
      </div>
    </div>
  </div>
</div>`
})

app.mount('#app');