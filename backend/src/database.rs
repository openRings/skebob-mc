use anyhow::Context;
use sqlx::{MySql, MySqlPool};
use std::ops::{Deref, DerefMut};

pub trait Executor<'a>: sqlx::Executor<'a, Database = MySql> {}

#[derive(Clone)]
pub struct Database {
    pool: MySqlPool,
}

impl Database {
    pub fn new() -> anyhow::Result<Self> {
        let pool = MySqlPool::connect_lazy("mysql://root:root@database:3306/minecraft")
            .context("failed to initialize database pool")?;

        tracing::info!("database pool initialized");

        Ok(Self { pool })
    }

    pub fn pool(&self) -> &MySqlPool {
        &self.pool
    }
}

impl<'a, E> Executor<'a> for E where E: sqlx::Executor<'a, Database = MySql> {}

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
