package com.plan3.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import java.time.LocalDate
import java.time.LocalTime

@Entity
@Table(name = "sis_empresa")
class SisEmpresa : BaseEntity() {

    @Column(name = "datacadastro")
    var datacadastro: LocalDate? = LocalDate.now()

    @Column(name = "horacadastro")
    var horacadastro: LocalTime? = LocalTime.now()

    @Column(name = "nome_empresa", nullable = false, length = 120)
    var nomeEmpresa: String = ""
}
