<template>
    <div class="grid-container">
        <table class="grid-view center">
            <thead>
            <tr class="grid-header no-border-y">
                <th v-for="col in columns"
                    :key="col.key"
                    @click="sortBy(col.key)"
                    :class="{ active: sortKey == col.key }"
                    class="p1 grid-header-cell"
                >
                    {{ col.title }}
                    <span v-if="sortKey === col.key" class="arrow" :class="sortOrder > 0 ? 'asc' : 'dsc'">
                  </span>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(entry, entryIndex) in sortedResults" :key="`entry-${entryIndex}`" class="grid-row"
                :class="{ 'star-row': starList.some(id => id === entry.id) }"
                @click="starRow(entry.id)">
                <td v-for="(col, index) in columns" :key="`entry-${entryIndex}-${index}`" class="p1 grid-cell">
                    {{entry[col.key]}}
                </td>
            </tr>
            </tbody>
        </table>
        <div class="grid-pagination center">
            <button :class="{ 'disabled': this.currentPage === 1 }" @click=movePages(-1)>قبلی</button>
            <p class="no-margin">{{ this.currentPage }} از {{ this.lastPage }}</p>
            <button :class="{ 'disabled': this.currentPage === this.lastPage }" @click=movePages(1)>بعدی</button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            gridData: {
                type: Array,
                required: true,
            },
            titles: {
                type: Array,
                required: true,
            },
            sortKey: {
                type: String,
                default: '',
            },
            sortOrder: {
                type: Number,
                default: 1,
            },
        },
        data () {
            let columns = Object.keys(this.gridData[0]).map((key, index) => {
                return { key, title: this.titles[index] };
            });
            return {
                columns,
                pageSize: 20,
                startIndex: 0,
                starList: [],
            };
        },
        computed: {
            sortedResults () {
                let results = this.gridData;
                if (this.sortKey) {
                    results = results.sort((a, b) => {
                        a = a[this.sortKey];
                        b = b[this.sortKey];
                        if (typeof(a) !== typeof(b)) // using local compare when having variety of types for sorting
                            return a.toString().localeCompare(b.toString()) * this.sortOrder;
                        else
                            return (a === b ? 0 : a > b ? 1 : -1) * this.sortOrder;
                    });
                }
                return results.slice(this.startIndex, this.startIndex + this.pageSize);
            },
            currentPage() {
                return this.startIndex / this.pageSize + 1;
            },
            lastPage () {
                return Math.ceil(this.gridData.length / this.pageSize);
            },
        },
        mounted () {
            this.starList = localStorage.getItem('starList').split(',').map(item => parseInt(item)) || [];
        },
        methods: {
            sortBy (key) {
                this.$emit('sort-by', key);
            },
            movePages (amount) {
                let newStartIndex = this.startIndex + (amount * this.pageSize);
                if (newStartIndex >= 0 && newStartIndex < this.gridData.length) {
                    this.startIndex = newStartIndex;
                }
            },
            starRow (id) {
                if (this.starList.some(key => key === id)) {
                    this.starList.splice(this.starList.indexOf(id), 1);
                } else {
                    this.starList.push(id);
                }
                localStorage.setItem('starList', this.starList);
            },
        },
    };
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/vars';

.grid {
    &-container {
        border: 1px solid $mercury;
        border-radius: 4px;
        width: 100%;
        overflow: auto;
        background: $snow-white;
    }

    &-view {
        border-spacing: 0;
        border-collapse: collapse;
        min-width: 100%;

        .star-row {
            td:first-child {
                background: $golden;
            }
        }
    }

    &-header {
        background: $catskill-white;
        border: 1px solid $gray-light;
        cursor: pointer;

        &-cell {

            &:hover {
                background: $gray-lighter;
            }
        }
    }

    &-row {
        border-bottom: 1px solid $mercury;

        &:hover {
            background: $alice-blue;
        }
    }

    &-cell {
        max-width: 200px;
    }

    &-pagination {
        max-width: 200px;
        display: flex;
        justify-content: space-between;
        border-top: 1px solid $mercury;
        padding: 5px;
    }
}

.arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.66;

    &.asc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid $gray-manatee;
    }

    &.dsc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid $gray-manatee;
    }
}

.no-border-y {
    border-left: 0;
    border-right: 0;
}
</style>
