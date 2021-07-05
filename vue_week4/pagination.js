// import 分頁元件
export default{
    props:['page'],
    template:`<nav aria-label="Page navigation example">
    <ul class="pagination">

        <li class="page-item" :class="{'disabled':!page.has_pre}">
            <a class="page-link" href="#" aria-label="Previous" @click="$emit('get-product',page.current_page-1)">
            <span aria-hidden="true">&laquo;</span>
            </a>
        </li>

        <li class="page-item" :class="{'active' : item === page.current_page}" v-for="(item) in page.total_pages" :key="item">
            <a class="page-link" href="#" @click="$emit('get-product',item)"> {{item}} </a>
        </li>

        <li class="page-item" :class="{'disabled':!page.has_next}">
            <a class="page-link" href="#" aria-label="Next" @click="$emit('get-product',page.current_page+1)">
            <span aria-hidden="true">&raquo;</span>
            </a>
        </li>

    </ul>
    </nav>`,
}