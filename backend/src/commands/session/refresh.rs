use crate::database::Executor;

pub struct SessionRefreshCommand;

impl SessionRefreshCommand {
    pub async fn execute<'a>(
        old_session_id: u64,
        executor: impl Executor<'a>,
    ) -> anyhow::Result<()> {
    }
}
