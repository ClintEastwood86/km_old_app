import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { DragSortableProps } from './DragSortable.props';
import { SortableItem } from './SortableItem';

export const DragSortable = <T extends { id: number }>({
	items,
	onSwap,
	setItems,
	constructItem,
	className,
	...props
}: DragSortableProps<T>) => {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.findIndex((r) => r.id == active.id);
				const newIndex = items.findIndex((r) => r.id == over.id);

				const result = arrayMove(items, oldIndex, newIndex);
				onSwap && onSwap(result);
				return result;
			});
		}
	};

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				<div {...props} className={className}>
					{items.map((item, i) => (
						<SortableItem<T> props={item} key={item.id}>
							{constructItem(item, i)}
						</SortableItem>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
};
