const buildCategoryTree = (categoryList, parentId = "") => { // Dùng để gọi đệ quy nên không dùng module.export
  const tree = [];

  categoryList.forEach((item) => {
    if (item.parent == parentId)
    {
      const children = buildCategoryTree(categoryList, item.id);
      
      tree.push({
        id: item.id,
        name: item.name,
        children: children
      })
    }
  })

  return tree;
}

module.exports.buildCategoryTree = buildCategoryTree;