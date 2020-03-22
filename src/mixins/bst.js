export default {
    data () {
        return {
            bst: {},
        };
    },
    methods: {
        bstMiddle (items, value) {
            let startIndex = 0, stopIndex = items.length - 1, middle = Math.floor((stopIndex + startIndex) / 2);
            while (items[middle].key != value.key && startIndex < stopIndex) {
                //adjust search area
                if (value.key < items[middle].key) {
                    stopIndex = middle - 1;
                } else if (value.key > items[middle].key) {
                    startIndex = middle + 1;
                }
                //recalculate middle
                middle = Math.floor((stopIndex + startIndex) / 2);
            }
            //make sure it's the right value
            return (items[middle].key != value.key) ? -1 : items[middle];
        },
        bstSearch (items, value) {
            {
                let found = false, current = this.bst._root
                //make sure there's a node to search
                while (!found && current) {
                    //if the value is less than the current node's, go left
                    if (value < current.value){
                        current = current.left;
                        //if the value is greater than the current node's, go right
                    } else if (value > current.value){
                        current = current.right;
                        //values are equal, found it!
                    } else {
                        found = true;
                    }
                }
                //only proceed if the node was found
                return current.items;
            }
        },
        bstAdd (item, value) {
            //create a new item object, place data in
            let node = {
                    value,
                    items: [item],
                    left: null,
                    right: null
                },
                //used to traverse the structure
                current;
            //special case: no items in the tree yet
            if (!this.bst._root){
                this.bst._root = node;
            } else {
                current = this.bst._root;
                while(node){
                    //if the new value is less than this node's value, go left
                    if (value < current.value){

                        //if there's no left, then the new node belongs there
                        if (current.left === null){
                            current.left = node;
                            break;
                        } else {
                            current = current.left;
                        }
                        //if the new value is greater than this node's value, go right
                    } else if (value > current.value){
                        //if there's no right, then the new node belongs there
                        if (current.right === null){
                            current.right = node;
                            break;
                        } else {
                            current = current.right;
                        }
                        //if the new value is equal to the current one, just ignore
                    } else {
                        current.items.push(node.items[0])
                        break;
                    }
                }
            }
        },
    },
};