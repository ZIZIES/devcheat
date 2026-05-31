export type { Language, Section, Card, LevelContent, Example } from './types';

// ── common languages ──
import python     from './langs/python';
import javascript from './langs/javascript';
import typescript from './langs/typescript';
import c          from './langs/c';
import cpp        from './langs/cpp';
import java       from './langs/java';
import kotlin     from './langs/kotlin';
import csharp     from './langs/csharp';
import swift      from './langs/swift';
import go         from './langs/go';
import rust       from './langs/rust';
import bash       from './langs/bash';
import html       from './langs/html';
import css        from './langs/css';

// ── niche languages ──
import php        from './langs/php';
import ruby       from './langs/ruby';
import lua        from './langs/lua';
import perl       from './langs/perl';
import sql        from './langs/sql';
import r          from './langs/r';
import scala      from './langs/scala';
import dart       from './langs/dart';
import powershell from './langs/powershell';
import elixir     from './langs/elixir';
import haskell    from './langs/haskell';
import fsharp     from './langs/fsharp';
import erlang     from './langs/erlang';
import ocaml      from './langs/ocaml';
import clojure    from './langs/clojure';
import lisp       from './langs/lisp';
import zig        from './langs/zig';
import nim        from './langs/nim';
import julia      from './langs/julia';
import matlab     from './langs/matlab';
import x86asm     from './langs/x86asm';
import armasm     from './langs/armasm';
import fortran    from './langs/fortran';
import batch      from './langs/batch';
import machinecode from './langs/machinecode';
import brainfuck  from './langs/brainfuck';
import yaml       from './langs/yaml';

export const languages = [
  // common
  python, javascript, typescript, c, cpp, java, kotlin, csharp, swift, go, rust, bash, html, css,
  // niche
  php, ruby, lua, perl, sql, r, scala, dart, powershell, elixir, haskell,
  fsharp, erlang, ocaml, clojure, lisp, zig, nim, julia, matlab,
  x86asm, armasm, fortran, batch, machinecode, brainfuck, yaml, cobol, toml, graphql,
];
// appended
import cobol    from './langs/cobol';
import toml     from './langs/toml';
import graphql  from './langs/graphql';
