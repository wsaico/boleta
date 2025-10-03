import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function BoletaValidator() {
  const [datos, setDatos] = useState({
    sueldoBasico: '', diasTrabajados: '30', tieneAsignacion: false, horasExtras: '',
    tienePasi: false, montoEdenred: '', alimentacion: '', otrosHaberes: '',
    sistemaPension: 'ONP', afpNombre: 'INTEGRA',
    adelantoQuincena: '', adelantoAlimentacion: '', tieneComedor: false, 
    precioDesayuno: '10', otrosDescuentos: '', netoBoletaIngresado: ''
  });

  const [calculado, setCalculado] = useState(false);
  const [tooltip, setTooltip] = useState('');

  const h = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos(p => ({...p, [name]: type === 'checkbox' ? checked : value}));
  };

  // CÁLCULOS
  const sb = parseFloat(datos.sueldoBasico) || 0;
  const dt = parseFloat(datos.diasTrabajados) || 30;
  const sp = (sb / 30) * dt;
  const af = datos.tieneAsignacion ? 113 : 0;
  const he = parseFloat(datos.horasExtras) || 0;
  const pa = datos.tienePasi ? (parseFloat(datos.montoEdenred) || 0) : 0;
  const al = parseFloat(datos.alimentacion) || 0;
  const oh = parseFloat(datos.otrosHaberes) || 0;
  const tH = sp + af + he + pa + al + oh;

  const br = sp + af + he;
  let ap = 0, ca = 0, sa = 0, tA = 0;

  if (datos.sistemaPension === 'ONP') {
    ap = br * 0.13;
  } else {
    const t = {
      'INTEGRA': {a: 0.10, c: 0.0082, s: 0.0174},
      'PRIMA': {a: 0.10, c: 0.0116, s: 0.0174},
      'PROFUTURO': {a: 0.10, c: 0.0069, s: 0.0174},
      'HABITAT': {a: 0.10, c: 0.0106, s: 0.0174}
    }[datos.afpNombre];
    ap = br * t.a;
    ca = br * t.c;
    sa = br * t.s;
    tA = ap + ca + sa;
  }

  const ia = tH * 12;
  let ir = 0;
  if (ia > 5150 * 7) {
    const b = (tH * 12 - 5150 * 7) / 12;
    if (b <= 5 * 5150 / 12) ir = b * 0.08;
    else if (b <= 20 * 5150 / 12) ir = (5 * 5150 / 12) * 0.08 + (b - 5 * 5150 / 12) * 0.14;
    else if (b <= 35 * 5150 / 12) ir = (5 * 5150 / 12) * 0.08 + (15 * 5150 / 12) * 0.14 + (b - 20 * 5150 / 12) * 0.17;
    else if (b <= 45 * 5150 / 12) ir = (5 * 5150 / 12) * 0.08 + (15 * 5150 / 12) * 0.14 + (15 * 5150 / 12) * 0.17 + (b - 35 * 5150 / 12) * 0.20;
    else ir = (5 * 5150 / 12) * 0.08 + (15 * 5150 / 12) * 0.14 + (15 * 5150 / 12) * 0.17 + (10 * 5150 / 12) * 0.20 + (b - 45 * 5150 / 12) * 0.30;
  }

  const aq = parseFloat(datos.adelantoQuincena) || 0;
  const aa = parseFloat(datos.adelantoAlimentacion) || 0;
  const co = datos.tieneComedor ? (parseFloat(datos.precioDesayuno) || 10) * 0.25 * dt : 0;
  const od = parseFloat(datos.otrosDescuentos) || 0;
  const tP = datos.sistemaPension === 'ONP' ? ap : tA;
  const tD = tP + ir + aq + aa + co + od;
  const nC = tH - tD;
  const nB = parseFloat(datos.netoBoletaIngresado) || 0;
  const df = Math.abs(nC - nB);
  const ok = df < 0.50;
  const tAd = aq + aa;
  const dR = nC + tAd;

  const T = ({ id, text }) => (
    <div className="relative inline-block">
      <button type="button" onMouseEnter={() => setTooltip(id)} onMouseLeave={() => setTooltip('')}
        className="text-blue-500">
        <Info className="w-4 h-4" />
      </button>
      {tooltip === id && (
        <div className="absolute z-50 w-52 p-2 bg-gray-900 text-white text-xs rounded shadow-xl -top-1 left-6">
          {text}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-xl p-4 shadow-lg">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            📋 Validador de Boleta Peruana
          </h1>
        </div>

        {/* Formulario en 2 columnas */}
        <div className="bg-white shadow-xl">
          <div className="grid md:grid-cols-2 gap-0">
            
            {/* COLUMNA 1: INGRESOS */}
            <div className="p-6 border-r-4 border-green-500 bg-gradient-to-br from-white to-green-50">
              <h2 className="text-lg font-bold text-green-700 mb-4 pb-2 border-b-2 border-green-300">
                💰 INGRESOS
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    Sueldo
                    <T id="s" text="Tu remuneración base mensual según contrato" />
                  </label>
                  <input type="number" name="sueldoBasico" value={datos.sueldoBasico} onChange={h}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-base focus:border-green-500 focus:outline-none" 
                    placeholder="2600" step="0.01" />
                  <div className="flex items-center gap-2 mt-2">
                    <input type="number" name="diasTrabajados" value={datos.diasTrabajados} onChange={h}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center" min="1" max="31" />
                    <span className="text-sm text-gray-600">días</span>
                  </div>
                </div>

                <label className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:bg-green-50 cursor-pointer">
                  <input type="checkbox" name="tieneAsignacion" checked={datos.tieneAsignacion} onChange={h} 
                    className="w-5 h-5 text-green-600 rounded" />
                  <span className="font-semibold text-sm">Asig. Fam. S/113</span>
                  <T id="af" text="Beneficio del 10% de la RMV para trabajadores con hijos menores" />
                </label>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    H. Extras
                    <T id="he" text="Trabajo fuera de jornada. Se paga 25% más (días normales) o 100% más (feriados)" />
                  </label>
                  <input type="number" name="horasExtras" value={datos.horasExtras} onChange={h}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-base focus:border-green-500 focus:outline-none" 
                    placeholder="733.87" step="0.01" />
                </div>

                <label className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:bg-green-50 cursor-pointer">
                  <input type="checkbox" name="tienePasi" checked={datos.tienePasi} onChange={h} 
                    className="w-5 h-5 text-green-600 rounded" />
                  <span className="font-semibold text-sm">PASI</span>
                  <T id="pa" text="Tarjeta Edenred/Sodexo. NO es remunerativo, no paga pensiones ni impuestos" />
                </label>
                {datos.tienePasi && (
                  <input type="number" name="montoEdenred" value={datos.montoEdenred} onChange={h}
                    className="w-full px-3 py-2 border-2 border-green-300 rounded-lg font-mono text-base" 
                    placeholder="100.00" step="0.01" />
                )}

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    Alimentación 75%
                    <T id="al" text="La empresa paga el 75% del costo de tu comida" />
                  </label>
                  <input type="number" name="alimentacion" value={datos.alimentacion} onChange={h}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-base focus:border-green-500 focus:outline-none" 
                    placeholder="180" step="0.01" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1">Otros</label>
                  <input type="number" name="otrosHaberes" value={datos.otrosHaberes} onChange={h}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-base focus:border-green-500 focus:outline-none" 
                    placeholder="0" step="0.01" />
                </div>
              </div>
            </div>

            {/* COLUMNA 2: DESCUENTOS */}
            <div className="p-6 border-l-4 border-red-500 bg-gradient-to-br from-white to-red-50">
              <h2 className="text-lg font-bold text-red-700 mb-4 pb-2 border-b-2 border-red-300">
                📉 DESCUENTOS
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    Pensiones
                    <T id="sp" text="ONP: 13% sistema público. AFP: 10% + comisión + seguro sistema privado" />
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button type="button" onClick={() => setDatos(p => ({...p, sistemaPension: 'ONP'}))}
                      className={`flex-1 py-2 rounded-lg font-bold transition-all ${datos.sistemaPension === 'ONP' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>
                      ONP
                    </button>
                    <button type="button" onClick={() => setDatos(p => ({...p, sistemaPension: 'AFP'}))}
                      className={`flex-1 py-2 rounded-lg font-bold transition-all ${datos.sistemaPension === 'AFP' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>
                      AFP
                    </button>
                  </div>
                  {datos.sistemaPension === 'ONP' ? (
                    <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">13% del sueldo base</div>
                      <div className="text-xl font-bold text-purple-700">S/ {ap.toFixed(2)}</div>
                    </div>
                  ) : (
                    <>
                      <select name="afpNombre" value={datos.afpNombre} onChange={h}
                        className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg mb-2 font-semibold">
                        <option value="INTEGRA">AFP Integra</option>
                        <option value="PRIMA">AFP Prima</option>
                        <option value="PROFUTURO">AFP Profuturo</option>
                        <option value="HABITAT">AFP Habitat</option>
                      </select>
                      <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg space-y-1 text-sm">
                        <div className="flex justify-between"><span>Aporte (10%):</span><strong>S/ {ap.toFixed(2)}</strong></div>
                        <div className="flex justify-between"><span>Comisión:</span><strong>S/ {ca.toFixed(2)}</strong></div>
                        <div className="flex justify-between"><span>Seguro:</span><strong>S/ {sa.toFixed(2)}</strong></div>
                        <div className="flex justify-between font-bold text-base border-t border-purple-300 pt-1 mt-1">
                          <span>Total AFP:</span><strong className="text-purple-700">S/ {tA.toFixed(2)}</strong>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    Imp. Renta 5ta
                    <T id="ir" text="Si ganas más de 7 UIT al año (S/36,050), pagas impuesto retenido mensualmente" />
                  </label>
                  <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                    <div className="text-xl font-bold text-orange-700">S/ {ir.toFixed(2)}</div>
                    <div className="text-xs text-gray-600 mt-1">{ir > 0 ? 'Calculado automáticamente' : 'No aplica'}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    Adel. Quincena
                    <T id="aq" text="Dinero que YA recibiste a mitad de mes (aprox. día 15)" />
                  </label>
                  <input type="number" name="adelantoQuincena" value={datos.adelantoQuincena} onChange={h}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-base focus:border-red-500 focus:outline-none" 
                    placeholder="1085.20" step="0.01" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1">Adel. Alimentación</label>
                  <input type="number" name="adelantoAlimentacion" value={datos.adelantoAlimentacion} onChange={h}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-base focus:border-red-500 focus:outline-none" 
                    placeholder="180" step="0.01" />
                </div>

                <label className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:bg-red-50 cursor-pointer">
                  <input type="checkbox" name="tieneComedor" checked={datos.tieneComedor} onChange={h} 
                    className="w-5 h-5 text-red-600 rounded" />
                  <span className="font-semibold text-sm">Comedor 25%</span>
                  <T id="co" text="Pagas el 25% del precio del desayuno/almuerzo. Empresa paga 75%" />
                </label>
                {datos.tieneComedor && (
                  <div className="flex gap-2">
                    <input type="number" name="precioDesayuno" value={datos.precioDesayuno} onChange={h}
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg" 
                      placeholder="10.00" step="0.01" />
                    <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg font-bold">
                      S/ {co.toFixed(2)}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1">Otros</label>
                  <input type="number" name="otrosDescuentos" value={datos.otrosDescuentos} onChange={h}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-base focus:border-red-500 focus:outline-none" 
                    placeholder="0" step="0.01" />
                </div>
              </div>
            </div>
          </div>

          {/* TOTALES */}
          <div className="grid md:grid-cols-2 gap-0 border-t-4 border-gray-300">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 flex justify-between items-center text-white">
              <span className="text-lg font-bold">TOTAL INGRESOS</span>
              <span className="text-3xl font-bold">S/ {tH.toFixed(2)}</span>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-orange-600 p-4 flex justify-between items-center text-white">
              <span className="text-lg font-bold">TOTAL DESCUENTOS</span>
              <span className="text-3xl font-bold">S/ {tD.toFixed(2)}</span>
            </div>
          </div>

          {/* VALIDACIÓN */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 border-t-4 border-blue-500">
            <div className="max-w-2xl mx-auto">
              <label className="block text-center font-bold text-gray-800 mb-3 text-lg">
                NETO A PAGAR EN TU BOLETA
              </label>
              <div className="relative mb-4">
                <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-3xl font-bold text-gray-400">S/</span>
                <input type="number" name="netoBoletaIngresado" value={datos.netoBoletaIngresado} onChange={h}
                  className="w-full pl-16 pr-6 py-4 border-4 border-blue-400 rounded-xl font-mono text-3xl text-center font-bold focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200" 
                  placeholder="0.00" step="0.01" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setCalculado(true)} disabled={!datos.netoBoletaIngresado}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  VALIDAR
                </button>
                <button onClick={() => {setDatos({sueldoBasico: '', diasTrabajados: '30', tieneAsignacion: false, horasExtras: '', tienePasi: false, montoEdenred: '', alimentacion: '', otrosHaberes: '', sistemaPension: 'ONP', afpNombre: 'INTEGRA', adelantoQuincena: '', adelantoAlimentacion: '', tieneComedor: false, precioDesayuno: '10', otrosDescuentos: '', netoBoletaIngresado: ''}); setCalculado(false);}}
                  className="border-3 border-gray-400 text-gray-700 py-3 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all">
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTADOS */}
        {calculado && tH > 0 && (
          <div className="mt-6 space-y-4">
            {/* Estado principal */}
            <div className={`rounded-2xl p-8 shadow-2xl ${ok ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-orange-400 to-red-500'} text-white`}>
              <div className="flex items-center gap-6 mb-6">
                {ok ? <CheckCircle className="w-16 h-16" /> : <AlertTriangle className="w-16 h-16" />}
                <div>
                  <h2 className="text-4xl font-bold mb-2">{ok ? '✓ BOLETA CORRECTA' : '⚠ REVISAR BOLETA'}</h2>
                  <p className="text-xl">{ok ? 'Los cálculos coinciden' : 'Hay una diferencia'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur">
                <div className="text-center">
                  <p className="text-sm opacity-90 mb-1">Calculado</p>
                  <p className="text-3xl font-bold">S/ {nC.toFixed(2)}</p>
                </div>
                <div className="text-center border-x-2 border-white border-opacity-40">
                  <p className="text-sm opacity-90 mb-1">Tu Boleta</p>
                  <p className="text-3xl font-bold">S/ {nB.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-90 mb-1">Diferencia</p>
                  <p className="text-3xl font-bold">S/ {df.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Dinero real del mes */}
            {tAd > 0 && (
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-purple-400 rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold text-purple-900 text-2xl mb-4">💰 DINERO REAL DEL MES</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-xl">
                    <div className="text-gray-600 mb-1">Pago de ahora:</div>
                    <div className="text-3xl font-bold text-blue-600">S/ {nC.toFixed(2)}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <div className="text-gray-600 mb-1">Adelantos recibidos:</div>
                    <div className="text-3xl font-bold text-green-600">+ S/ {tAd.toFixed(2)}</div>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border-4 border-purple-400">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-900 font-bold text-2xl">TOTAL RECIBIDO:</span>
                    <span className="text-5xl font-bold text-purple-700">S/ {dR.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-4 bg-white bg-opacity-70 p-4 rounded-xl">
                  <p className="text-purple-900">
                    💡 <strong>¿Por qué el pago parece bajo?</strong> Ya recibiste <strong>S/ {tAd.toFixed(2)}</strong> como adelantos durante el mes.
                  </p>
                </div>
              </div>
            )}

            {/* Alerta si no coincide */}
            {!ok && df > 0.50 && (
              <div className="bg-orange-100 border-4 border-orange-400 rounded-xl p-6">
                <h4 className="font-bold text-orange-800 text-xl mb-3">⚠️ Diferencia: S/ {df.toFixed(2)}</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Verifica que ingresaste todos los conceptos correctamente</li>
                  <li>• Revisa los decimales (céntimos)</li>
                  <li>• Confirma el sistema de pensión (ONP/AFP) y AFP correcta</li>
                  <li>• Valida días trabajados y beneficios activos</li>
                  <li>• Si la diferencia es mayor a S/ 5.00, consulta con RRHH</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 bg-white rounded-b-xl p-4 text-center text-sm text-gray-600 shadow-lg">
          📋 Validador de Boletas de Pago - Sistema Peruano • Herramienta educativa
        </div>
      </div>
    </div>
  );
}
