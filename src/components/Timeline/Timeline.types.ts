export type TimelineEvent = {
  title: string;
  meta: string;
};

export type TimelineProps = {
  events: TimelineEvent[];
};
