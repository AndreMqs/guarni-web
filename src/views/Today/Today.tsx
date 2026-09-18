import { todayPageText } from '../../constants/today.ts'
import styles from './Today.module.scss'
import type { TodayViewProps } from './Today.types.ts'

export function TodayView({ dateLabel, summary, tasks }: TodayViewProps) {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>{todayPageText.productName}</span>
            <h1>{todayPageText.title}</h1>
          </div>
          <span className={styles.dateBadge}>{todayPageText.dateBadge}</span>
        </header>

        <main className={styles.main}>
          <p className={styles.date}>{dateLabel}</p>

          <section className={styles.summary} aria-labelledby="summary-title">
            <h2 id="summary-title">{todayPageText.summaryTitle}</h2>
            <div className={styles.summaryItems}>
              <strong>{summary.done}<span>{todayPageText.doneLabel}</span></strong>
              <strong>{summary.pending}<span>{todayPageText.pendingLabel}</span></strong>
              <strong>{summary.notDone}<span>{todayPageText.notDoneLabel}</span></strong>
            </div>
          </section>

          <div className={styles.tabs} role="tablist" aria-label={todayPageText.filterAriaLabel}>
            <button className={styles.activeTab} role="tab" aria-selected="true">{todayPageText.myTasksTab}</button>
            <button role="tab" aria-selected="false">{todayPageText.generalTasksTab}</button>
            <button role="tab" aria-selected="false">{todayPageText.allTasksTab}</button>
          </div>

          <section aria-labelledby="task-list-title">
            <h2 className={styles.listTitle} id="task-list-title">
              {tasks.length} {todayPageText.pendingTasksSuffix}
            </h2>
            <div className={styles.taskList}>
              {tasks.map((task) => (
                <article className={styles.taskCard} key={task.id}>
                  <div className={styles.taskMetaTop}>
                    <span className={styles.status}>{todayPageText.pendingTaskStatus}</span>
                    <span>{task.dueLabel}</span>
                  </div>
                  <h3>{task.title}</h3>
                  <p>{todayPageText.assigneePrefix} <strong>{todayPageText.currentUserLabel}</strong></p>
                  <p className={styles.evidence}>{todayPageText.evidenceIcon} {task.evidenceLabel}</p>
                </article>
              ))}
            </div>
          </section>
        </main>

        <nav className={styles.navigation} aria-label={todayPageText.navigationAriaLabel}>
          <button className={styles.activeNav}><span>{todayPageText.todayNavigationIcon}</span>{todayPageText.todayNavigationLabel}</button>
          <button><span>{todayPageText.historyNavigationIcon}</span>{todayPageText.historyNavigationLabel}</button>
          <button><span>{todayPageText.moreNavigationIcon}</span>{todayPageText.moreNavigationLabel}</button>
        </nav>
      </div>
    </div>
  )
}
