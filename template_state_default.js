`
@immutable
class {bloc.name}State {
  final $State.default.items.typeName$ items;
  final $State.default.meta.typeName$ meta;
  final $State.default.loadStatus.typeName$ loadStatus;
  final $State.default.error.typeName$ error;
//  final Map<String, String> filters;
//  final String search;

  $BlocName$State({
    @required this.items,
    @required this.meta,
    @required this.loadStatus,
    @required this.error,
//    @required this.filters,
//    @required this.search,
  });

  @override
  $BlocName$State copyWith({
    $State.default.items.typeName$ items,
    $State.default.meta.typeName$ meta,
    $State.default.loadStatus.typeName$ loadStatus,
    error,
//    Map<String, String> filters,
//    String search,
  }) {
    return new $BlocName$State(
      items: items ?? this.items,
      meta: meta ?? this.meta,
      error: error ?? this.error,
      loadStatus: loadStatus ?? this.loadStatus,
//      filters: filters ?? this.filters,
//      search: search ?? this.search,
    );
  }

  @override
  toMap() => {
    'items': items.toList(),
    'meta': meta.toString(),
    'loadStatus': loadStatus.toString(),
    'error': error.toString(),
//    'filters': filters.toString(),
//    'search': search,
//    'currentPage': currentPage,
//    'canLoadNext': canLoadNext,
  };

    UserDBO byId(String id) {
      return items.firstWhere((element) => element.id == id);
    }

    int get currentPage => meta?.currentPage ?? 1;
    bool get canLoadNext {
      return meta != null ? meta.lastPage > meta.currentPage : false;
    }

}
`