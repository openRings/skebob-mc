use anyhow::Context;
use sqlx::MySqlPool;
use std::ops::{Deref, DerefMut};

#[derive(Clone)]
pub struct Database {
    pool: MySqlPool,
}

impl Database {
    pub fn new() -> anyhow::Result<Self> {
        let pool = MySqlPool::connect_lazy("mysql://root:root@database:3306/minecraft")
            .context("failed to initialize database pool")?;

        Ok(Self { pool })
    }

    pub fn pool(&self) -> &MySqlPool {
        &self.pool
    }
}

impl Deref for Database {
    type Target = MySqlPool;

    fn deref(&self) -> &Self::Target {
        &self.pool
    }
}

impl DerefMut for Database {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.pool
    }
}
