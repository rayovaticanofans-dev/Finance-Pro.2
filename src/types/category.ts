export interface CategoryNode {
  id: string;
  label: string;
  parentId?: string;
  color: string;
  emoji: string;
  children?: CategoryNode[];
  isCustom?: boolean;
}

export interface CategoryGroup {
  id: string;
  label: string;
  categories: CategoryNode[];
}
