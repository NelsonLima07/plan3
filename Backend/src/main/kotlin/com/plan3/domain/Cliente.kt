package com.plan3.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Entity
@Table(name = "clientes")
class Cliente : BaseEntity() {

    @Column(name = "datacadastro")
    var datacadastro: LocalDate? = LocalDate.now()

    @Column(name = "horacadastro")
    var horacadastro: LocalTime? = LocalTime.now()

    @Column(name = "delete_at")
    var deleteAt: LocalDateTime? = null

    @Column(name = "update_at")
    var updateAt: LocalDateTime? = null

    @Column(name = "id_empresa", nullable = false)
    var idEmpresa: Long = 0

    @Column(name = "tipo_pessoa", nullable = false, length = 1)
    var tipoPessoa: String = "F"

    @Column(name = "nome_pessoa", nullable = false, length = 120)
    var nomePessoa: String = ""

    @Column(name = "cpf_cnpj", length = 25)
    var cpfCnpj: String? = null
}
