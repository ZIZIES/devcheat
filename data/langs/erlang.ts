import { lang, section, card } from '../helpers';

export default lang({
  id: "erlang", name: "Erlang", ext: ".erl", year: 1986, common: false,
  sections: [
    section("basics", "basics", [
      card("syntax + basics", {
        beginner: {
          explanation: "Erlang was built by Ericsson in 1986 to power telephone switches that needed 99.9999999% uptime (nine nines — less than 31ms downtime per year). It achieves this through isolated processes, message passing, and let-it-crash philosophy. Elixir is built on top of Erlang. Erlang's syntax is unusual — statements end with periods, clauses separate with semicolons.",
          code: `% percent sign is the comment character
% file: hello.erl

-module(hello).        % module name must match filename
-export([hello/0]).    % export hello function with 0 arguments

% function definition — ends with period
hello() ->
    io:format("Hello, World!~n").   % ~n = newline

% multiple clauses with pattern matching
% clauses separated by semicolons, last ends with period
factorial(0) -> 1;                          % base case
factorial(N) when N > 0 -> N * factorial(N - 1).  % recursive case

% variables start with UPPERCASE (or _)
% atoms are lowercase or quoted
Name = "Alice",                % variable
Status = ok,                   % atom (like a symbol)
Result = {ok, 42},             % tuple
List = [1, 2, 3, 4, 5].        % list`,
          examples: [
            { input: `$ erl\n1> hello:hello().`, output: `Hello, World!\nok` },
            { input: `hello:factorial(5).`, output: `120` },
          ],
          note: "in Erlang, variables can only be bound ONCE — you can't change them. = is pattern matching just like Elixir. if you need a loop, use recursion. Erlang has no for/while loops",
        },
        intermediate: {
          explanation: "Erlang processes are the core abstraction. spawn creates a new process. send (!) and receive handle message passing. Processes are isolated — a crash in one doesn't affect others.",
          code: `% spawn a process
Pid = spawn(fun() ->
    io:format("Hello from process ~p~n", [self()])
end),

% send a message (! is the send operator)
Pid ! {hello, "world"},

% receive messages
receive
    {hello, Msg} ->
        io:format("Got: ~s~n", [Msg]);
    {error, Reason} ->
        io:format("Error: ~p~n", [Reason])
after
    5000 ->
        io:format("Timeout~n")
end.

% gen_server — OTP behaviour for stateful servers
-module(counter).
-behaviour(gen_server).

% start the server
start_link() -> gen_server:start_link({local, ?MODULE}, ?MODULE, 0, []).

% initialize with state = 0
init(0) -> {ok, 0}.

% handle increment call
handle_call(increment, _From, State) ->
    {reply, ok, State + 1};
% handle get call
handle_call(get, _From, State) ->
    {reply, State, State}.`,
          examples: [
            { input: `Pid = spawn(fun() -> receive stop -> ok end end),\nPid ! stop.`, output: `ok  % process receives and exits cleanly` },
          ],
          note: "OTP (Open Telecom Platform) is Erlang's framework of behaviours (gen_server, gen_statem, supervisor) that handle all the common patterns for building fault-tolerant systems. always use OTP instead of raw processes",
        },
        advanced: {
          explanation: "Supervisor trees are how Erlang achieves fault tolerance. Supervisors monitor worker processes and restart them when they crash. The 'let it crash' philosophy means you don't defensively code — you let errors crash processes and supervisors restart them.",
          code: `% supervisor — monitors and restarts child processes
-module(my_supervisor).
-behaviour(supervisor).

init([]) ->
    Children = [
        #{
            id      => worker1,
            start   => {my_worker, start_link, []},
            restart => permanent,  % always restart
            type    => worker
        }
    ],
    {ok, {
        #{strategy => one_for_one,  % restart only the crashed child
          intensity => 3,           % max 3 restarts
          period    => 60           % within 60 seconds
        },
        Children
    }}.

% strategies:
% one_for_one — restart only the crashed child
% one_for_all — restart ALL children if one crashes
% rest_for_one — restart crashed + all started after it

% ETS — Erlang Term Storage (in-memory key-value store)
TableId = ets:new(my_table, [set, public]),
ets:insert(TableId, {key, value}),
ets:lookup(TableId, key),   % [{key, value}]`,
          examples: [
            { input: `% if worker crashes, supervisor restarts it\n% automatically — no manual intervention needed`, output: `fault tolerance built into the architecture` },
          ],
          note: "the 'let it crash' philosophy sounds dangerous but it's actually safer. instead of defensive coding that might miss edge cases, you let errors propagate, crash the process, and rely on supervisors to restart cleanly",
        },
      }),
    ]),
  ],
});
