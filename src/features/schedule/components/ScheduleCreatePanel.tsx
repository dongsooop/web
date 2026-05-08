import ScheduleCreateForm from './ScheduleCreateForm';

type ScheduleCreatePanelProps = {
  onCloseAction: () => void;
  onSaveAction: () => void;
};

export default function ScheduleCreatePanel({
  onCloseAction,
  onSaveAction,
}: ScheduleCreatePanelProps) {
  return (
    <aside className="border-gray2 hidden border-t bg-white lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:border-t-0">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-white bg-white">
        <ScheduleCreateForm
          mode="panel"
          onCloseAction={onCloseAction}
          onSaveAction={onSaveAction}
        />
      </div>
    </aside>
  );
}
