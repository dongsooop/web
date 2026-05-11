export type PickerTarget = 'start' | 'end';

export type PickerState = PickerTarget | null;

export type FormState = {
  title: string;
  place: string;
  allDay: boolean;
  color: string;
  startAt: Date;
  endAt: Date;
  picker: PickerState;
};

export type FormAction =
  | { type: 'text'; key: 'title' | 'place'; value: string }
  | { type: 'allDay'; value: boolean }
  | { type: 'color'; value: string }
  | { type: 'picker'; value: PickerState }
  | { type: 'datetime'; target: PickerTarget; value: Date };
