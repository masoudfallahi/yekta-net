<template>
    <div>
        <h1 class="title">تغییرات آگهی</h1>
        <form class="search-form" @submit.prevent="submit" ref="form">
            <div class="field">
                <label class="label">تغییر دهنده</label>
                <input type="text" class="input" name="name" v-model.trim="filters.name">
            </div>
            <div class="field">
                <label class="label">تاریخ</label>
                <input type="text" class="input" name="date" v-model.trim="filters.date">
            </div>
            <div class="field">
                <label class="label">آگهی</label>
                <input type="text" class="input" name="title" v-model.trim="filters.title">
            </div>
            <div class="field">
                <label class="label">فیلد</label>
                <input type="text" class="input" name="field" v-model.trim="filters.field">
            </div>
            <div class="field btn-field">
                <button type="submit" class="button">جستجو</button>
                <button type="button" class="button btn-clear" @click="reset">پاک کردن</button>
            </div>
        </form>
        <GridView :grid-data="filteredResults" :titles="titles" :sort-key="sortKey" :sort-order="sortOrder" @sort-by="sortBy"/>
    </div>
</template>

<script>
// data
import gridData from '../data/data.json';
// components
import GridView from '../components/common/GridView.vue';
// mixins
import bst from '../mixins/bst.js';

export default {
    components: {
        GridView,
    },
    mixins: [bst],
    data() {
        return {
            gridData,
            titles: [
                'ID',
                'تغییر دهنده',
                'تاریخ',
                'آگهی',
                'فیلد',
                'مقدار قبلی',
                'مقدار جدید',
            ],
            filters: {
                name: this.$route.query.name,
                date: this.$route.query.date,
                title: this.$route.query.title,
                field: this.$route.query.field,
            },
            filteredResults: gridData,
            sortKey: this.$route.query.sortKey,
            sortOrder: parseInt(this.$route.query.sortOrder) || 1,
        };
    },
    mounted () {
        this.makeBST(this.gridData);
        if (Object.keys(this.filters).some(key => this.filters[key])) {
            this.submit();
        }
    },
    methods: {
        makeBST (items) {
            // add middle item as root object
            const middle = this.bstMiddle(items, items[0].date);
            this.bstAdd(middle, middle.date);
            items.forEach(item => {
                this.bstAdd(item, item.date);
            });
        },
        submit() {
            if (Object.keys(this.filters).some(key => this.filters[key])) {
                this.setQueryString();
                // reset filtered results
                this.filteredResults = this.gridData;
                Object.keys(this.filters).forEach(filter => {
                    if (this.filters[filter]) {// check for filter has value
                        if (filter === 'date') {
                            this.filteredResults = this.bstSearch(this.filteredResults, this.filters[filter]);
                        } else {
                            this.filteredResults = this.filteredResults.filter(row => {
                                return row[filter] === this.filters[filter];
                            });
                        }
                    }
                });
            } else { // reset results
                this.filteredResults = this.gridData;
            }
        },
        setQueryString () {
            // set filters to query string
            this.$router.replace({ query: { ...this.filters, sortKey: this.sortKey, sortOrder: this.sortKey && this.sortOrder } });
        },
        reset () {
            this.filters = {};
            this.setQueryString();
        },
        sortBy (key) {
            this.sortKey = key;
            this.sortOrder *= -1;
            this.setQueryString();
        }
    },
};
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/vars';

.title {
    text-align: right;
    font-size: 1.2em;
}

.search-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 10px 20px;
    background: $snow-white;
    border: solid 1px $gray-athens;
    border-radius: 4px;
    margin-bottom: 20px;
}

.field {
    margin: 5px;
    flex: 1 0 20%;
    display: flex;
    align-items: center;

    .label {
        margin-left: 10px;
        min-width: 75px;
        text-align: left;
    }

    .input {
        border: 1px solid $gray-light;
        border-radius: 3px;
        padding: 3px 5px;
    }
}

    .button {
        background-color: $silver-tree;
        border: 1px solid $patina;
        border-radius: 3px;
        min-width: 150px;
        padding: 3px 5px;
        margin: 0 10px;
        cursor: pointer;

        &:hover {
            box-shadow: 1px 1px 5px 1px $bon-jour;
        }
    }

    .btn-clear {
        background: $snow-white;
    }

    .btn-field {
        justify-content: flex-end;

        @media (max-width: 767px) {
            display: block;

            .button {
                margin: 5px;
                width: 100%;
            }
        }
    }
</style>