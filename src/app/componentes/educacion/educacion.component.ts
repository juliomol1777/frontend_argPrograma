import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Educacion } from 'src/app/entidades/educacion';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { PorfolioService } from 'src/app/servicios/porfolio.service';

@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css']
})
export class EducacionComponent implements OnInit {

  educacionList!:Educacion[];
  usuarioAutenticado:Boolean = false;
  form:FormGroup;

  constructor(private datosPorfolio:PorfolioService, private miFormBuilder:FormBuilder,
              private autenticacion:AutenticacionService) {
      this.form=this.miFormBuilder.group({
        id: [''],
        school:['',[Validators.required]],
        title:['',[Validators.required]],
        image:['',[Validators.required]],
        career:['',[Validators.required]],
        start:['',[Validators.required]],
        end:['',[Validators.required]]
        })
     }

     private cargarDatos(){
      this.datosPorfolio.obtenerDatosEducacion().subscribe( data => {
        this.educacionList = data;
      })
     }

  ngOnInit(): void {
    this.usuarioAutenticado= this.autenticacion.usuarioAutenticado;
    this.cargarDatos();
  }

  private limpiarForm() {
    this.form.setValue({
      id:'',
      school: '',
      title: '',
      image: '',
      career: '',
      start: '',
      end: ''
    })
  }

  onNuevaEducacion(){
    this.limpiarForm();
  }

  onSubmit() {
    let educacion: Educacion = this.form.value;
    if (this.form.get('id')?.value == '') {
      this.datosPorfolio.crearDatosEducacion(educacion).subscribe(
        (newEducation: Educacion) => {
          this.educacionList.push(newEducation);
        }
      );
    } else {
      this.datosPorfolio.editarDatosEducacion(educacion).subscribe(
        () => {
          this.cargarDatos();
        }
      )
    }
  }


  onEditarEducacion(index: number) {
    let educacion: Educacion = this.educacionList[index];
    this.mostrarDatosEducacion(educacion);
  }

  onBorrarEducacion(index: number) {
    let educacion: Educacion = this.educacionList[index];
    if (confirm("??Est?? seguro que desea borrar la educaci??n seleccionada?")) {
      this.datosPorfolio.borrarDatosEducacion(educacion.id).subscribe(
        () => {
          this.cargarDatos();
        }
      )
    }
  }

  private mostrarDatosEducacion(educacion: Educacion) {
    this.form.setValue({
      id: educacion.id,
      school: educacion.school,
      title: educacion.title,
      image: educacion.image,
      career: educacion.career,
      start: educacion.start,
      end: educacion.end
    })
  }

}
