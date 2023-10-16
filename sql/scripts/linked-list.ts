type ListItem = {
  next: ListItem | undefined;
  prev: ListItem | undefined;
  value: number;
};

const createList = (initial: number[]) => {
  const list: ListItem[] = initial.map(value => ({
    value,
    next: undefined,
    prev: undefined,
  }));

  list.forEach((item, i, arr) => {
    item.prev = arr[i - 1];
    item.next = arr[i + 1];
  });

  return { first: list[0], last: list[list.length - 1] };
};

const step = (item: ListItem, direction: 'next' | 'prev') => {
  console.log(`Value: ${item.value}, Direction: ${direction}`);
  if (direction === 'next' && item.next) {
    step(item.next, direction);
  } else if (direction === 'prev' && item.prev) {
    step(item.prev, direction);
  } else {
    console.log('the list has concluded, thanks for everything');
  }
};

const list = createList([1, 10, 9, 2, 8, 3, 7, 5, 6]);
step(list.first, 'next');
step(list.last, 'prev');
