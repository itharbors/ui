# UI TREE

```html
<ui-tree><ui-tree>

<script>
    const $tree = document.querySelector('ui-tree');
    $tree.register('item-init', ($item, data) => {
        $item.innerHTML = /*html*/`
            <div></div>
        `;
    });
    $tree.register('item-update', ($item, data) => {

    });
</script>
```