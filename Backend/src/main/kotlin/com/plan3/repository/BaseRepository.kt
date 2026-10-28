package com.plan3.repository

import com.plan3.domain.BaseEntity
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepositoryBase
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
abstract class BaseRepository<T : BaseEntity> : PanacheRepositoryBase<T, Long>
