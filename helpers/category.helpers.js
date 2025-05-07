const buildCategoryTree = (categoryList, parentId = "") => { // Dùng để gọi đệ quy nên không dùng module.export
  const tree = [];

  categoryList.forEach((item) => {
    if (item.parent == parentId) {
      const children = buildCategoryTree(categoryList, item.id);

      tree.push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        children: children
      })
    }
  })

  return tree;
}

module.exports.buildCategoryTree = buildCategoryTree;

const findAllCategory = (categoryList, targetId) => {
  const categoryListTree = buildCategoryTree(categoryList);
  const findRoot = (categoryListTree, targetId) => {
    for (const item of categoryListTree)
    {
      if (item.id == targetId)
        return item;
      else
      {
        if (item.children.length)
        {
          const found = findRoot(item.children, targetId);
          if (found) return found;
        }
      }
    }
    return null;
  }
  const root = findRoot(categoryListTree, targetId);

  const solve = (root) => {
    let ans = [];
    ans.push(root.id);
    for (const children of root.children)
    {
      ans = ans.concat(solve(children));
    }
    return ans;
  }
  return solve(root);
}

module.exports.findAllCategory = findAllCategory;