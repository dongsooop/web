export type ScheduleColorToken = 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'orange';

export type PickerTarget = 'start' | 'end';

export type PickerState = PickerTarget | null;

export type FormState = {
  title: string;
  place: string;
  allDay: boolean;
  color: ScheduleColorToken;
  startAt: Date;
  endAt: Date;
  picker: PickerState;
};

export type FormAction =
  | { type: 'text'; key: 'title' | 'place'; value: string }
  | { type: 'allDay'; value: boolean }
  | { type: 'color'; value: ScheduleColorToken }
  | { type: 'picker'; value: PickerState }
  | { type: 'datetime'; target: PickerTarget; value: Date };
